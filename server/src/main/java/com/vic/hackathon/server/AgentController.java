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

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AgentController {

    @Value("${zai.api.key}")
    private String zaiApiKey;
    
    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping(value = "/strategize", produces = "application/json")
    public ResponseEntity<String> generateSpecificStrategy(@RequestBody Map<String, Object> requestPayload) {
        
        // ==========================================
        // STAGE 1: PRE-API PROCESSING & VALIDATION
        // ==========================================
        
        // 1. Extract the data safely
        String userTopic = (String) requestPayload.get("prompt");

        // 2. Validate the input (Protecting your API)
        if (userTopic == null || userTopic.trim().isEmpty()) {
            System.out.println("⚠️ Warning: Received empty prompt from frontend.");
            
            // Return an error to React IMMEDIATELY before wasting an API call
            String errorJson = "{\"error\": \"Buddy needs a topic! Please type something before generating.\"}";
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorJson);
        }

        // 3. Optional Sanitize: Prevent prompt injection (Basic level)
        if (userTopic.length() > 500) {
            userTopic = userTopic.substring(0, 500); // Limit to 500 characters so users can't break the AI
        }

        System.out.println("✅ Pre-API Check Passed. Topic: " + userTopic);


        // ==========================================
        // STAGE 2: BUILD THE AI CONTEXT
        // ==========================================
        
        String systemPrompt = "You are 'Content Buddy', a world-class social media strategist. " +
            "Topic: " + userTopic + ". " +
            "Target Audience: A broad, global audience on short-form video platforms. " +
            "Tone: Professional, engaging, and high-energy. " +
            "Return ONLY a raw JSON object with: 'hook', 'script', 'sonicDna', 'trendReport', and 'storyboard'. " +
            "The 'storyboard' must be an array of objects: 'id', 'shotType', 'movement', 'action', 'dialogue', 'duration'. " +
            "Do not include markdown symbols.";

            
        // ==========================================
        // STAGE 3: THE ACTUAL API CALL
        // ==========================================
        
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
            
            // Cleanup the JSON response
            String result = response.getBody();
            if (result != null) {
                result = result.replaceAll("```json", "").replaceAll("```", "").trim();
            }
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"error\": \"Buddy's AI brain is currently offline.\"}");
        }
    }
}