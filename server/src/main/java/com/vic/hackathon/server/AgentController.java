package com.vic.hackathon.server;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper(); // Parses the API response

    // ==========================================
    // ENDPOINT 1: GENERATE NEW PROJECT
    // ==========================================
    @PostMapping(value = "/strategize", produces = "application/json")
    public ResponseEntity<String> generateSpecificStrategy(@RequestBody Map<String, Object> requestPayload) {
        
        String userTopic = (String) requestPayload.get("prompt");

        if (userTopic == null || userTopic.trim().isEmpty()) {
            System.out.println("⚠️ Warning: Received empty prompt from frontend.");
            String errorJson = "{\"error\": \"Buddy needs a topic! Please type something before generating.\"}";
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorJson);
        }

        if (userTopic.length() > 500) {
            userTopic = userTopic.substring(0, 500);
        }

        System.out.println("✅ Pre-API Check Passed. Topic: " + userTopic);

        // THE FIX: We explicitly tell the AI to use the EXACT keys that Suggestions.jsx expects.
        String systemPrompt = "You are 'Content Buddy', a world-class social media strategist. " +
            "User Topic: " + userTopic + ". " +
            "Target Audience: A broad, global audience on short-form video platforms. " +
            "Tone: Professional, engaging, and high-energy. " +
            "Return ONLY a raw JSON object with the following keys: 'hook', 'sonicDna', 'script', and 'storyboard'. " +
            "The 'storyboard' MUST be an array of exactly 4 objects containing these exact keys: 'id' (number), 'scene' (string), 'character' (string), 'shooting' (string), 'editing' (string), 'dialogue' (string), and 'duration' (string). " +
            "Do not include markdown symbols, do not include ```json blocks, just return raw JSON.";

        // Fixed the URL format here!
        String zaiApiUrl = "[https://api.z.ai/v1/chat/completions](https://api.z.ai/v1/chat/completions)"; 
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(zaiApiKey);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "glm-5.1-flash");
        body.put("messages", List.of(Map.of("role", "user", "content", systemPrompt)));
        body.put("temperature", 0.7); 

        try {
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(zaiApiUrl, entity, String.class);
            
            // Extract the actual JSON from the AI's "choices" wrapper
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            String generatedJson = rootNode.path("choices").get(0).path("message").path("content").asText();
            
            // Clean up any rogue markdown just in case the AI disobeys
            generatedJson = generatedJson.replaceAll("```json", "").replaceAll("```", "").trim();
            
            System.out.println("✅ AI Generation Successful!");
            return ResponseEntity.ok(generatedJson);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"error\": \"Buddy's AI brain is currently offline.\"}");
        }
    }


    // ==========================================
    // ENDPOINT 2: REFINE EXISTING PROJECT (CO-PILOT)
    // ==========================================
    @PostMapping(value = "/refine", produces = "application/json")
    public ResponseEntity<String> refineProject(@RequestBody Map<String, String> request) {
        
        // Receive the ENTIRE project state from React
        String currentData = request.get("currentData"); 
        String instruction = request.get("instruction");

        if (currentData == null || instruction == null) {
            return ResponseEntity.badRequest().body("{\"error\": \"Missing data or instruction\"}");
        }

        System.out.println("🔄 Refining Entire Project with instruction: " + instruction);

        // Tell the AI to rewrite the whole object based on the new instruction
        String systemPrompt = "You are a master social media strategist and video director. " +
            "Here is the current video project data (JSON): " + currentData + ". " +
            "The user gave this instruction to change the project: \"" + instruction + "\". " +
            "Update the content to reflect this change. You can rewrite the hook, the script, and the storyboard actions/dialogue to match the new vibe. " +
            "Return ONLY a raw JSON object with the exact same structure: 'hook', 'sonicDna', 'script', and 'storyboard' (array of 4 objects with id, scene, character, shooting, editing, dialogue, duration). " +
            "Do not include markdown or ```json wrappers.";

        String zaiApiUrl = "https://api.z.ai/v1/chat/completions"; 
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(zaiApiKey);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "glm-5.1-flash");
        body.put("messages", List.of(Map.of("role", "user", "content", systemPrompt)));
        body.put("temperature", 0.7);

        try {
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(zaiApiUrl, entity, String.class);
            
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            String generatedJson = rootNode.path("choices").get(0).path("message").path("content").asText();
            generatedJson = generatedJson.replaceAll("```json", "").replaceAll("```", "").trim();
            
            System.out.println("✅ Project Refined Successfully!");
            return ResponseEntity.ok(generatedJson);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"error\": \"Failed to refine project.\"}");
        }
    }
}