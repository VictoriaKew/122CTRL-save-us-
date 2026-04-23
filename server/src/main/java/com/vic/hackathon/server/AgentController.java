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
@CrossOrigin(origins = "http://localhost:5173")
public class AgentController {

    @Value("${zai.api.key}")
    private String zaiApiKey;
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${zai.api.url}")
    private String zaiApiUrl;

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

        // STRICT PROMPT: Forces high-quality personas and exact JSON structures 
        String systemPrompt = "Act as a Viral Content Strategist for Gen-Z. " +
            "Create a strategy for Topic: '" + userTopic + "' with style references: " + cleanLinks.toString() + ".\n\n" +
            "Return ONLY a raw JSON object in this EXACT format:\n" +
            "{\n" +
            "  \"hook\": \"Short, high-retention opening line\",\n" +
            "  \"sonicDna\": \"Detailed description of trending audio and SFX\",\n" +
            "  \"script\": \"A high-energy script as a single string\",\n" +
            "  \"storyboard\": [\n" +
            "    { \"scene\": 1, \"visual\": \"Detailed visual description 1\" },\n" +
            "    { \"scene\": 2, \"visual\": \"Detailed visual description 2\" }\n" +
            "  ]\n" +
            "}\n\n" +
            "Note: 'storyboard' MUST be an array of OBJECTS. Do not include any chat text.";

        return callZaiApi(systemPrompt, "strategy");
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

        String systemPrompt = "Act as a Social Media Policy Moderator. Analyze this script for " + platforms.toString() + " compliance: '" + script + "'.\n" +
            "Return ONLY raw JSON in this format:\n" +
            "{\n" +
            "  \"score\": 85,\n" +
            "  \"issues\": [\n" +
            "    { \"type\": \"warning\", \"platform\": \"TikTok\", \"title\": \"Pacing\", \"desc\": \"Example desc\" }\n" +
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
            "Maintain the original tone and structure. Return ONLY raw JSON.";

        return callZaiApi(systemPrompt, "strategy");
    }

    private boolean isKeyMissing() {
        return zaiApiKey == null || zaiApiKey.trim().isEmpty() || zaiApiKey.startsWith("${"); 
    }

    private ResponseEntity<?> callZaiApi(String prompt, String type) {
        if (isKeyMissing()) return getMockProjectResponse("MOCK Mode");

       System.out.println("🌐 Calling Real ILMU-GLM-5.1 API...");
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        // 🚨 HACKATHON OVERRIDE: Delete the 'zaiApiKey' variable.
        // Paste your literal key string right here inside the quotes.
        // Example: headers.set("x-api-key", "sk-ant-ilmu-12345ABCDE...");
        headers.set("x-api-key", "sk-e920fff60f267961643c18d6315a8f683f0d76de6f42dcce"); 
        
        headers.set("anthropic-version", "2023-06-01");

        Map<String, Object> body = new HashMap<>();
        body.put("model", "ilmu-glm-5.1"); // Exact model name from handbook [cite: 1, 9]
        body.put("messages", List.of(Map.of("role", "user", "content", prompt)));
        body.put("max_tokens", 4096);

        try {
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            // application.properties: zai.api.url=https://api.ilmu.ai/anthropic/v1/messages
            ResponseEntity<String> response = restTemplate.postForEntity(zaiApiUrl, entity, String.class);
            
            String responseBody = response.getBody();
            JsonNode rootNode = objectMapper.readTree(responseBody);
            // Anthropic Messages structure: content[0].text [cite: 1, 306]
            String text = rootNode.path("content").get(0).path("text").asText().trim();
            
            // BULLETPROOF EXTRACTION: Find the first { and last } to avoid conversational text crashes 
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
            return ResponseEntity.status(500).body(Map.of("error", "AI Response Mismatch. Check terminal."));
        }
    }

    private ResponseEntity<ProjectResponse> getMockProjectResponse(String title) {
        ProjectResponse mock = new ProjectResponse();
        mock.hook = title;
        mock.script = "Mock script active.";
        return ResponseEntity.ok(mock);
    }

    private ResponseEntity<ComplianceResponse> getMockComplianceResponse() {
        ComplianceResponse mock = new ComplianceResponse();
        mock.score = 100;
        mock.issues = new ArrayList<>();
        return ResponseEntity.ok(mock);
    }
}

// ==========================================
// DATA MODELS (Equipped with Safety Shields)
// ==========================================

@JsonIgnoreProperties(ignoreUnknown = true) // Ignores unknown fields like "id" or "duration" 
class ProjectResponse {
    public String hook;
    public String sonicDna;
    public String script;
    public List<StoryboardRow> storyboard = new ArrayList<>();

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class StoryboardRow {
        public int scene;
        public String visual; // Explicitly matches the "visual" field from ILMU-GLM-5.1 
    }
}

@JsonIgnoreProperties(ignoreUnknown = true)
class ComplianceResponse {
    public int score;
    public List<ComplianceIssue> issues = new ArrayList<>();

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ComplianceIssue {
        public String type; // 'warning' | 'success'
        public String platform;
        public String title;
        public String desc;
    }
}