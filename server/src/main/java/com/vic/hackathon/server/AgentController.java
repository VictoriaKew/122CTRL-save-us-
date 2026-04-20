package com.vic.hackathon.server;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AgentController {

    // Injects the key from your application.properties
    @Value("${zai.api.key}")
    private String zaiApiKey;
    
    private final RestTemplate restTemplate = new RestTemplate();

    // --------------------------------------------------------
    // PHASE 1: The Style Extractor
    // --------------------------------------------------------
    @GetMapping(value = "/generate", produces = "application/json")
    public String generateMockStrategy() {
        // Keeping this as a static mock for now so the UI transitions smoothly.
        // You can upgrade this to a live LLM call later if you have time!
        return """
            {
              "status": "success",
              "styleProfile": {
                "tone": "High-energy and educational",
                "pacing": "Fast, cuts every 3 seconds",
                "catchphrases": ["Wait for it...", "Stop scrolling!"]
              }
            }
            """;
    }

    // --------------------------------------------------------
    // PHASE 2: The Strategist (LIVE AI BRIDGE)
    // --------------------------------------------------------
    @PostMapping(value = "/strategize", produces = "application/json")
    public ResponseEntity<String> generateSpecificStrategy(@RequestBody Map<String, Object> requestPayload) {
        
        // 1. Extract what the user typed in the React UI
        String userTopic = (String) requestPayload.getOrDefault("prompt", "A cool tech project");

        // 2. Build the Agentic Prompt
        String systemPrompt = "You are 'Content Buddy', an expert social media strategist. " +
                              "Generate a viral content strategy for the following topic: " + userTopic + ". " +
                              "Respond ONLY in valid JSON format with the keys: hook, script, visuals, audio, caption, complianceScore, guardianWarning. " +
                              "Do not include markdown blocks, just the raw JSON.";

        // 3. Setup the HTTP Request to Z.ai (GLM-5.1-Flash)
        // NOTE: Replace the URL below with the actual API endpoint provided by Z.ai
        String zaiApiUrl = "https://api.z.ai/v1/chat/completions"; 
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(zaiApiKey);

        // Standard Chat Completion Payload Structure
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "glm-5.1-flash");
        
        Map<String, String> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", systemPrompt);
        requestBody.put("messages", new Object[]{message});
        requestBody.put("temperature", 0.3); // Kept low for consistent JSON

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            // 4. Fire the request!
            ResponseEntity<String> response = restTemplate.postForEntity(zaiApiUrl, entity, String.class);
            
            // Return the raw JSON string from the AI back to React
            // Note: You might need to parse the response body depending on Z.ai's exact JSON wrapper
            return ResponseEntity.ok(response.getBody()); 
            
        } catch (Exception e) {
            // Fallback strategy if the API fails
            return ResponseEntity.status(500).body("{\"status\":\"error\", \"message\":\"Buddy's brain is offline. Check API key or URL.\"}");
        }
    }
}