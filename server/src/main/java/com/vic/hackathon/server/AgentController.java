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
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173") // Adjust if your React port changes
public class AgentController {

    @Value("${zai.api.key}")
    private String zaiApiKey;
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${zai.api.url}")
    private String zaiApiUrl;

    // ==========================================
    // PHASE 01: STRATEGIZE (Upgraded for Pure Visuals)
    // ==========================================
    @PostMapping(value = "/strategize", produces = "application/json")
    public ResponseEntity<?> generateSpecificStrategy(@RequestBody Map<String, Object> requestPayload) {
        String userTopic = (String) requestPayload.get("prompt");
        List<String> rawLinks = (List<String>) requestPayload.get("links");

        if (userTopic == null || userTopic.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Topic required"));
        }

        List<String> cleanLinks = (rawLinks == null) ? new ArrayList<>() : rawLinks.stream()
                .filter(link -> link != null && !link.trim().isEmpty())
                .map(String::trim).collect(Collectors.toList());

        System.out.println("✅ Phase 01 Request: " + userTopic);

        // 🔥 CRITICAL FIX PROMPT: Added strict rules to separate visual and audio data
        String systemPrompt = "Act as a Tier-1 Viral Content Strategist for Gen-Z TikTok & Shorts. " +
            "Analyze the vibe of these reference links: " + cleanLinks.toString() + " and create a highly engaging video strategy for the Topic: '" + userTopic + "'.\n\n" +
            "The content MUST be fast-paced, relatable, and highly engaging. Do not be generic.\n\n" +
            "STORYBOARD RULES (To prevent broken images):\n" +
            "1. 'visual' and 'characterAction' fields must contain PURE visual descriptions. ZERO mention of dialogue, text-on-screen, music cues (like '(Music swells)') or technical jargon.\n" +
            "2. 'dialogue' field must contain ONLY spoken words or text-on-screen cues.\n\n" +
            "CRITICAL JSON RULES:\n" +
            "1. Return ONLY raw JSON.\n" +
            "2. Escape all double quotes (e.g., \\\"This\\\"!\\\").\n\n" +
            "EXACT FORMAT TO RETURN:\n" +
            "{\n" +
            "  \"hook\": \"Punchy title.\",\n" +
            "  \"sonicDna\": \"Trending audio style.\",\n" +
            "  \"script\": \"Write the social media CAPTION here, not the script.\",\n" +
            "  \"storyboard\": [\n" +
            "    { \n" +
            "      \"scene\": 1, \n" +
            "      \"visual\": \"Pure visual description (e.g., Wide POV shot of messy bedroom).\", \n" +
            "      \"characterAction\": \"Pure action (e.g., Host jumps onto bed).\", \n" +
            "      \"wayOfShooting\": \"Angle\", \n" +
            "      \"wayOfEditing\": \"Transition\", \n" +
            "      \"dialogue\": \"Spoken words or text-cues ONLY.\"\n" +
            "    }\n" +
            "  ]\n" +
            "}";

        return callZaiApi(systemPrompt, "strategy");
    }

    // ==========================================
    // PHASE 03: COMPLIANCE (Isolated Script)
    // ==========================================
    @PostMapping(value = "/compliance", produces = "application/json")
    public ResponseEntity<?> checkCompliance(@RequestBody Map<String, Object> request) {
        String script = (String) request.get("script");
        List<String> platforms = (List<String>) request.get("platforms");

        System.out.println("🛡️ Scanning script for: " + platforms);

        if (isKeyMissing()) return getMockComplianceResponse();

        // 🔥 CRITICAL FIX PROMPT: Used XML-like tags to isolate user data from instructions
        String systemPrompt = "Act as a strict Trust & Safety Policy AI for " + platforms.toString() + ". " +
            "Analyze the script content provided between the <SCRIPT_CONTENT> tags for potential violations against community guidelines.\n\n" +
            "<SCRIPT_CONTENT>\n" + script + "\n</SCRIPT_CONTENT>\n\n" +
            "CRITICAL RULES:\n" +
            "1. Analyze ONLY the content inside the tags above.\n" +
            "2. If the tags are empty or no content is found inside them, return score 0 and issue type 'error' stating 'No caption/script content provided'. Do not use demo data.\n" +
            "3. If content exists, generate at least 2 relevant platform-specific safety reminders or warnings.\n" +
            "4. Return ONLY raw JSON in this format:\n" +
            "{\n" +
            "  \"score\": 90,\n" +
            "  \"issues\": [\n" +
            "    { \"type\": \"warning\", \"platform\": \"TikTok\", \"title\": \"Audience Warning\", \"desc\": \"Reminder about safety standard\" }\n" +
            "  ]\n" +
            "}";

        return callZaiApi(systemPrompt, "compliance");
    }

    // ==========================================
    // PHASE 04: CO-PILOT (Refine)
    // ==========================================
    @PostMapping(value = "/refine", produces = "application/json")
    public ResponseEntity<?> refineProject(@RequestBody Map<String, Object> request) {
        Object currentData = request.get("currentData"); 
        String instruction = (String) request.get("instruction");

        System.out.println("🔄 Refining with: " + instruction);

        String systemPrompt = "You are a Creative Director. Update this JSON project data: " + currentData.toString() + 
            " based on user feedback: '" + instruction + "'. " +
            "Ensure updated fields follow the original constraints (especially visual fields having zero audio/dialogue cues). Return ONLY raw JSON.";

        return callZaiApi(systemPrompt, "strategy");
    }

    private boolean isKeyMissing() {
        return zaiApiKey == null || zaiApiKey.trim().isEmpty() || zaiApiKey.startsWith("${"); 
    }

    private ResponseEntity<?> callZaiApi(String prompt, String type) {
        if (isKeyMissing()) return getMockProjectResponse("MOCK Mode");

        System.out.println("🌐 Calling Real ILMU-GLM-5.1 API...");
        
        System.out.println("🔑 DEBUG KEY CHECK: [" + zaiApiKey + "]");
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        headers.set("Authorization", "Bearer " + zaiApiKey); 
        headers.set("anthropic-version", "2023-06-01"); 

        Map<String, Object> body = new HashMap<>();
        body.put("model", "ilmu-glm-5.1");
        body.put("messages", List.of(Map.of("role", "user", "content", prompt)));
        body.put("max_tokens", 4096);
        // Turn temperature down slightly to make JSON more stable
        body.put("temperature", 0.3); 

        try {
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(zaiApiUrl, entity, String.class);
            
            String responseBody = response.getBody();
            JsonNode rootNode = objectMapper.readTree(responseBody);
            String text = rootNode.path("content").get(0).path("text").asText().trim();
            
            // JSON Extraction
            int firstBrace = text.indexOf("{");
            int lastBrace = text.lastIndexOf("}");
            if (firstBrace == -1 || lastBrace == -1) throw new Exception("AI failed to send JSON data");
            
            String cleanJson = text.substring(firstBrace, lastBrace + 1);

            if (type.equals("compliance")) {
                return ResponseEntity.ok(objectMapper.readValue(cleanJson, ComplianceResponse.class));
            } else {
                return ResponseEntity.ok(objectMapper.readValue(cleanJson, ProjectResponse.class));
            }
            
        } catch (Exception e) {
            System.err.println("❌ ERROR: " + e.getMessage());
            if (e instanceof HttpStatusCodeException) {
                System.err.println("Server Said: " + ((HttpStatusCodeException)e).getResponseBodyAsString());
            }
            return ResponseEntity.status(500).body(Map.of("error", "AI messed up the data structure. Please try regenerating."));
        }
    }

    private ResponseEntity<ProjectResponse> getMockProjectResponse(String title) {
        ProjectResponse mock = new ProjectResponse();
        mock.hook = title;
        mock.script = "Mock mode is active because your API key is missing from application.properties.";
        return ResponseEntity.ok(mock);
    }

    private ResponseEntity<ComplianceResponse> getMockComplianceResponse() {
        ComplianceResponse mock = new ComplianceResponse();
        mock.score = 92; // The infamous 92 from earlier!
        mock.issues = new ArrayList<>();
        ComplianceResponse.ComplianceIssue issue = new ComplianceResponse.ComplianceIssue();
        issue.type = "info";
        issue.platform = "All";
        issue.title = "Mock Compliance";
        issue.desc = "Backend is running in mock mode. Check API key.";
        mock.issues.add(issue);
        return ResponseEntity.ok(mock);
    }
}

// ==========================================
// DATA MODELS (Upgraded to match Frontend)
// ==========================================

@JsonIgnoreProperties(ignoreUnknown = true)
class ProjectResponse {
    public String hook;
    public String sonicDna;
    public String script;
    public List<StoryboardRow> storyboard = new ArrayList<>();

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class StoryboardRow {
        public int scene;
        public String visual;
        public String characterAction;
        public String wayOfShooting;
        public String wayOfEditing;
        public String dialogue;
    }
}

@JsonIgnoreProperties(ignoreUnknown = true)
class ComplianceResponse {
    public int score;
    public List<ComplianceIssue> issues = new ArrayList<>();

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ComplianceIssue {
        public String type; 
        public String platform;
        public String title;
        public String desc;
    }
}