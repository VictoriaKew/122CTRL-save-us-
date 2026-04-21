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

// Built-in Spring Boot JSON tools
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

    @PostMapping(value = "/strategize", produces = "application/json")
    public ResponseEntity<String> generateSpecificStrategy(@RequestBody Map<String, Object> requestPayload) {
        
        // ==========================================
        // STAGE 1: PRE-API PROCESSING & VALIDATION
        // ==========================================
        
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

        // ==========================================
        // STAGE 2: BUILD THE AI CONTEXT (FIXED FOR REACT)
        // ==========================================
        
        // THE FIX: We explicitly tell the AI to use the EXACT keys that Suggestions.jsx expects.
        String systemPrompt = "You are 'Content Buddy', a world-class social media strategist. " +
            "User Topic: " + userTopic + ". " +
            "Target Audience: A broad, global audience on short-form video platforms. " +
            "Tone: Professional, engaging, and high-energy. " +
            "Return ONLY a raw JSON object with the following keys: 'hook', 'sonicDna', 'script', and 'storyboard'. " +
            "The 'storyboard' MUST be an array of exactly 4 objects containing these exact keys: 'id' (number), 'scene' (string), 'character' (string), 'shooting' (string), 'editing' (string), 'dialogue' (string), and 'duration' (string). " +
            "Do not include markdown symbols, do not include ```json blocks, just return raw JSON.";

            
        // ==========================================
        // STAGE 3: THE ACTUAL API CALL
        // ==========================================
        
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
            
            // THE FIX: Extract the actual JSON from the AI's "choices" wrapper
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
}