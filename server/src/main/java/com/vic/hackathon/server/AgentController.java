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

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173") 
public class AgentController {

   @Value("${zai.api.key:}")
    private String zaiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

   @Value("${zai.api.url:https://api.ilmu.ai/anthropic/v1/messages}")
    private String zaiApiUrl;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")  
    private String supabaseKey;

    // ==========================================
    // PHASE 01: STRATEGIZE 
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
    // PHASE 02: Persistence Layer 
    // ==========================================
    private void saveToSupabase(ProjectResponse project) {
    String supabaseUrl = "https://fotkonztoknosscvjnbc.supabase.co";
    String supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvdGtvbnp0b2tub3NzY3ZqbmJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzA5ODUsImV4cCI6MjA5MjQ0Njk4NX0.xt9qgixJjhV6ItrQTZuH_N-wbplGDplYIfg3lEexPt4"; // Use Service Role Key to bypass RLS for backend

    HttpHeaders headers = new HttpHeaders();
    headers.set("apikey", supabaseKey);
    headers.set("Authorization", "Bearer " + supabaseKey);
    headers.set("Content-Type", "application/json");
    headers.set("Prefer", "return=representation"); // Returns the created ID

    try {

        Map<String, Object> projectMap = Map.of(
        "hook", project.hook,
        "sonic_dna", project.sonicDna,
        "script", project.script
    );
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(projectMap, headers);
        ResponseEntity<JsonNode> response = restTemplate.postForEntity(supabaseUrl, entity, JsonNode.class);
        
        String projectId = response.getBody().get(0).get("id").asText();

        String scenesUrl = "https://your-project-ref.supabase.co/rest/v1/storyboard_scenes";
        List<Map<String, Object>> scenesBatch = project.storyboard.stream().map(row -> {
            Map<String, Object> scene = new HashMap<>();
            scene.put("project_id", projectId);
            scene.put("scene_number", row.scene);
            scene.put("visual", row.visual);
            scene.put("character_action", row.characterAction);
            scene.put("shooting_style", row.wayOfShooting);
            scene.put("editing_style", row.wayOfEditing);
            scene.put("dialogue", row.dialogue);
            return scene;
        }).collect(Collectors.toList());

        restTemplate.postForEntity(scenesUrl, new HttpEntity<>(scenesBatch, headers), String.class);
        System.out.println("✅ Data successfully synced to Supabase!");

    } catch (Exception e) {
        System.err.println("⚠️ Supabase Sync Failed: " + e.getMessage());
    }
    }

    // ==========================================
    // PHASE 03: COMPLIANCE 
    // ==========================================
    @PostMapping(value = "/compliance", produces = "application/json")
    public ResponseEntity<?> checkCompliance(@RequestBody Map<String, Object> request) {
        String script = (String) request.get("script");
        List<String> platforms = (List<String>) request.get("platforms");

        System.out.println("🛡️ Scanning script for: " + platforms);

        if (isKeyMissing()) return getMockComplianceResponse();

        String systemPrompt = "Act as a strict Trust & Safety Policy AI for " + platforms.toString() + ". " +
            "Analyze the script content provided between the <SCRIPT_CONTENT> tags.\n\n" +
            "<SCRIPT_CONTENT>\n" + script + "\n</SCRIPT_CONTENT>\n\n" +
            "CRITICAL RULES:\n" +
            "1. Generate 3 to 5 strict platform-specific safety reminders, terms and conditions, or algorithm restrictions based ON THE PLATFORMS CHOSEN (e.g., TikTok commercial audio rules, YouTube Shorts pacing algorithms).\n" +
            "2. DO NOT GENERATE A SCORE. Only return the issues/reminders.\n" +
            "3. Return ONLY raw JSON in this format:\n" +
            "{\n" +
            "  \"issues\": [\n" +
            "    { \"type\": \"warning\", \"platform\": \"TikTok\", \"title\": \"Commercial Audio Limit\", \"desc\": \"Reminder: Unoriginal audio longer than 60s will be muted by TikTok.\" }\n" +
            "  ]\n" +
            "}";

        return callZaiApi(systemPrompt, "compliance");
    }

    // ==========================================
    // PHASE 04: CO-PILOT 
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
        body.put("max_tokens", 2048);
        body.put("temperature", 0.3); 

        try {
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(zaiApiUrl, entity, String.class);
            
            String responseBody = response.getBody();
            JsonNode rootNode = objectMapper.readTree(responseBody);
            String text = rootNode.path("content").get(0).path("text").asText().trim();
            
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
            
            System.out.println("⚠️ ILMU API failed. Triggering Emergency Demo Fallback Data.");
            
            if (type.equals("compliance")) {
                return getMockComplianceResponse();
            } else {
                return getMockProjectResponse("Viral Hackathon Strategy 🚀");
            }
        }
    } 

    // Safety net for when ILMU API fails   
        private ResponseEntity<ProjectResponse> getMockProjectResponse(String title) {
        ProjectResponse mock = new ProjectResponse();
        mock.hook = "The Truth About Tech Event Planning 🤯";
        mock.sonicDna = "Trending: Fast-paced Lofi Beats / Sigma Male Grindset audio";
        mock.script = "When the vendor says 'front-print only' 3 days before GDGoC UM Week... 💀 Here is how our FSKTM publicity team handled the ultimate pivot. Save this if you're running a tech event! #UM #FSKTM #TechEvents";
        
        // Scene 1
        ProjectResponse.StoryboardRow row1 = new ProjectResponse.StoryboardRow();
        row1.scene = 1;
        row1.visual = "Close-up on a laptop screen showing a sick 3D pixel art T-shirt design.";
        row1.characterAction = "Creator points at the screen looking proud.";
        row1.wayOfShooting = "Push in close-up";
        row1.wayOfEditing = "Hard cut to next scene";
        row1.dialogue = "We spent weeks on this back-print design...";
        mock.storyboard.add(row1);

        // Scene 2
        ProjectResponse.StoryboardRow row2 = new ProjectResponse.StoryboardRow();
        row2.scene = 2;
        row2.visual = "Creator holding phone, looking stressed.";
        row2.characterAction = "Creator sighs and dramatically rubs temples.";
        row2.wayOfShooting = "High angle, slightly shaky";
        row2.wayOfEditing = "Glitch transition";
        row2.dialogue = "...then the vendor called.";
        mock.storyboard.add(row2);

        // Scene 3
        ProjectResponse.StoryboardRow row3 = new ProjectResponse.StoryboardRow();
        row3.scene = 3;
        row3.visual = "Time-lapse of moving elements in Canva/CapCut to fit only the front.";
        row3.characterAction = "Rapid clicking and dragging.";
        row3.wayOfShooting = "Screen recording / Over-the-shoulder";
        row3.wayOfEditing = "Speed ramp (fast forward)";
        row3.dialogue = "Front-print only? Fine. Watch us pivot.";
        mock.storyboard.add(row3);
        
        return ResponseEntity.ok(mock);
    }

    private ResponseEntity<ComplianceResponse> getMockComplianceResponse() {
        ComplianceResponse mock = new ComplianceResponse();
        mock.issues = new ArrayList<>();
        ComplianceResponse.ComplianceIssue issue = new ComplianceResponse.ComplianceIssue();
        issue.type = "warning";
        issue.platform = "TikTok";
        issue.title = "Mock Compliance Warning";
        issue.desc = "Backend API timed out (504). This is the emergency demo data keeping your UI alive!";
        mock.issues.add(issue);
        return ResponseEntity.ok(mock);
    }
}

