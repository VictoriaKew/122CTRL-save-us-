package com.vic.hackathon.server;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AgentController {

    @Value("${zai.api.key}")
    private String zaiApiKey;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final String ZAI_API_URL = "https://api.z.ai/v1/chat/completions";

    // ==========================================
    // ENDPOINT 1: GENERATE PROJECT (Strategize)
    // ==========================================
    @PostMapping(value = "/strategize", produces = "application/json")
    public ResponseEntity<?> generateSpecificStrategy(@RequestBody Map<String, Object> requestPayload) {
        
        String userTopic = (String) requestPayload.get("prompt");
        List<String> rawLinks = (List<String>) requestPayload.get("links");

        if (userTopic == null || userTopic.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Buddy needs a topic! Please type something before generating."));
        }

        // --- UPGRADE 2: URL PRE-PROCESSING ---
        // We clean the links to remove extra spaces and ignore empty inputs
        List<String> cleanLinks = (rawLinks == null) ? new ArrayList<>() : rawLinks.stream()
                .filter(link -> link != null && !link.trim().isEmpty())
                .map(String::trim)
                .collect(Collectors.toList());

        System.out.println("✅ Request Received. Topic: " + userTopic + " | Links provided: " + cleanLinks.size());

        String systemPrompt = "You are 'Content Buddy'. Analyze these style references: " + cleanLinks.toString() + ". " +
            "Topic: " + userTopic + ". Return ONLY a raw JSON with 'hook', 'sonicDna', 'script', and 'storyboard'.";

        return callZaiApi(systemPrompt, "strategy");
    }

    // ==========================================
    // ENDPOINT 2: COMPLIANCE SCAN (Phase 03)
    // ==========================================
    @PostMapping(value = "/compliance", produces = "application/json")
    public ResponseEntity<?> checkCompliance(@RequestBody Map<String, Object> request) {
        String script = (String) request.get("script");
        List<String> platforms = (List<String>) request.get("platforms");

        System.out.println("🛡️ Scanning script for platforms: " + platforms);

        if (isKeyMissing()) {
            return getMockComplianceResponse();
        }

        String systemPrompt = "Analyze this script for " + platforms.toString() + " compliance: " + script + 
            ". Return ONLY a raw JSON object with 'score' (0-100) and an array of 'issues' (type, platform, title, desc).";

        return callZaiApi(systemPrompt, "compliance");
    }

    // ==========================================
    // ENDPOINT 3: REFINE PROJECT (Co-Pilot)
    // ==========================================
    @PostMapping(value = "/refine", produces = "application/json")
    public ResponseEntity<?> refineProject(@RequestBody Map<String, Object> request) {
        Object currentData = request.get("currentData"); 
        String instruction = (String) request.get("instruction");

        if (currentData == null || instruction == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing data or instruction"));
        }

        System.out.println("🔄 Refining Project with instruction: " + instruction);

        String systemPrompt = "Update this project: " + currentData.toString() + " based on: " + instruction + 
            ". Return ONLY a raw JSON object with the exact same structure.";

        return callZaiApi(systemPrompt, "strategy");
    }

    // ==========================================
    // CORE LOGIC: MOCK vs REAL API
    // ==========================================
    
private boolean isKeyMissing() {
    // TODO: DELETE 'return true' WHEN I GET THE REAL API KEY!
    return true; // THIS FORCES MOCK MODE 100% OF THE TIME
}

    private ResponseEntity<?> callZaiApi(String prompt, String type) {
        
        // --- MOCK GATEKEEPER ---
        if (isKeyMissing()) {
            try {
                Thread.sleep(2000); // Simulate network delay
                if (type.equals("compliance")) return getMockComplianceResponse();
                return getMockProjectResponse("MOCK Strategy: " + prompt.substring(0, Math.min(20, prompt.length())) + "...");
            } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        }

        // --- REAL API CALL ---
        System.out.println("🌐 Calling Real Z.ai API...");
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(zaiApiKey);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "glm-5.1-flash");
        body.put("messages", List.of(Map.of("role", "user", "content", prompt)));
        body.put("temperature", 0.7);

        try {
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(ZAI_API_URL, entity, String.class);
            
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            String generatedJson = rootNode.path("choices").get(0).path("message").path("content").asText();
            
            generatedJson = generatedJson.replaceAll("```json", "").replaceAll("```", "").trim();
            
            if (type.equals("compliance")) {
                ComplianceResponse comp = objectMapper.readValue(generatedJson, ComplianceResponse.class);
                return ResponseEntity.ok(comp);
            } else {
                ProjectResponse project = objectMapper.readValue(generatedJson, ProjectResponse.class);
                return ResponseEntity.ok(project);
            }
            
        } catch (Exception e) {
            // --- UPGRADE 3: PRODUCTION ERROR LOGGING ---
            System.err.println("❌ CRITICAL ERROR IN [" + type.toUpperCase() + "] CALL");
            System.err.println("Message: " + e.getMessage());
            e.printStackTrace(); 
            return ResponseEntity.status(500).body(Map.of("error", "AI brain offline. Check VS Code console."));
        }
    }

    // ==========================================
    // HELPER MOCK GENERATORS
    // ==========================================
    private ResponseEntity<ProjectResponse> getMockProjectResponse(String title) {
        ProjectResponse mock = new ProjectResponse();
        mock.hook = title;
        mock.sonicDna = "MOCK: Viral Acoustic Pop";
        mock.script = "This is a mock script. The Java backend plumbing is 100% ready!";
        mock.storyboard = new ArrayList<>();
        return ResponseEntity.ok(mock);
    }

    private ResponseEntity<ComplianceResponse> getMockComplianceResponse() {
        ComplianceResponse mock = new ComplianceResponse();
        mock.score = 92;
        mock.issues = List.of(
            new ComplianceResponse.ComplianceIssue("warning", "TikTok", "Pacing", "Video might be too long for TikTok average attention span."),
            new ComplianceResponse.ComplianceIssue("success", "YouTube", "Content", "Clean content detected.")
        );
        return ResponseEntity.ok(mock);
    }

    // ==========================================
    // DATABASE: SAVE PROJECT & SCENES
    // ==========================================
    @PostMapping("/save-full-project")
    public ResponseEntity<?> saveFullProject(@RequestBody Map<String, Object> payload) {
        try {
            // 1. Extract Project Info
            String userId = (String) payload.get("user_id");
            String title = (String) payload.get("title");
            String hook = (String) payload.get("hook");
            String script = (String) payload.get("script");
            String sonicDna = (String) payload.get("sonicDna");
            List<Map<String, Object>> storyboard = (List<Map<String, Object>>) payload.get("storyboard");

            // 2. Prepare Supabase Headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("apikey", supabaseKey);
            headers.set("Authorization", "Bearer " + supabaseKey);
            headers.set("Prefer", "return=representation"); // Returns the created project_id

            // 3. Save to 'history' (or projects) table
            Map<String, Object> projectBody = Map.of(
                "user_id", userId,
                "title", title,
                "hook", hook,
                "script", script,
                "sonic_dna", sonicDna
            );

            HttpEntity<Map<String, Object>> projectEntity = new HttpEntity<>(projectBody, headers);
            ResponseEntity<String> projectResponse = restTemplate.postForEntity(
                supabaseUrl.trim() + "/rest/v1/history", projectEntity, String.class
            );

            // 4. Get the generated Project ID
            JsonNode projectNode = objectMapper.readTree(projectResponse.getBody());
            int generatedProjectId = projectNode.get(0).get("project_id").asInt();

            // 5. Save all Scenes to 'scenes' table
            for (int i = 0; i < storyboard.size(); i++) {
                Map<String, Object> scene = storyboard.get(i);
                scene.put("project_id", generatedProjectId);
                scene.put("scene_order", i + 1); // Sets the order 1, 2, 3...

                HttpEntity<Map<String, Object>> sceneEntity = new HttpEntity<>(scene, headers);
                restTemplate.postForEntity(supabaseUrl.trim() + "/rest/v1/scenes", sceneEntity, String.class);
            }

            return ResponseEntity.ok(Map.of("message", "Success! Project ID " + generatedProjectId + " saved with scenes."));

        } catch (Exception e) {
            System.err.println("❌ Database Error: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Failed to sync with Supabase."));
        }
    }

    // ==========================================
    // DATABASE: USER INFO MANAGEMENT
    // ==========================================
    @PostMapping("/sync-user")
public ResponseEntity<?> syncUser(@RequestBody Map<String, Object> userData) {
    // Check your IDE console for this! 
    // If password_hash is null here, the problem is in the React code.
    System.out.println("📥 DATA RECEIVED BY JAVA: " + userData); 

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("apikey", supabaseKey);
    headers.set("Authorization", "Bearer " + supabaseKey);

    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(userData, headers);
    
    try {
        String url = supabaseUrl.trim() + "/rest/v1/user_info";
        return restTemplate.postForEntity(url, entity, String.class);
    } catch (org.springframework.web.client.HttpStatusCodeException e) {
        System.err.println("🔥 SUPABASE ERROR: " + e.getResponseBodyAsString());
        return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
    }
}
}
