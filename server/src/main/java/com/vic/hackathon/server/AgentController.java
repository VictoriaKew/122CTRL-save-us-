package com.vic.hackathon.server;

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173") // CRITICAL: Allows React to connect!
public class AgentController {

    // --------------------------------------------------------
    // PHASE 1: The Style Extractor (Triggered by pasting a URL)
    // --------------------------------------------------------
    @GetMapping("/generate")
    public String generateMockStrategy() {
        return """
            {
              "status": "success",
              "styleProfile": {
                "tone": "High-energy and educational",
                "pacing": "Fast, cuts every 3 seconds",
                "catchphrases": ["Wait for it...", "Stop scrolling!"]
              },
              "suggestedContent": [
                {
                  "id": 1,
                  "hook": "Stop studying like it's 2010...",
                  "platform": "TikTok",
                  "warning": "Safe: No banned words detected."
                }
              ]
            }
            """;
    }

    // --------------------------------------------------------
    // PHASE 2: The Strategist (Triggered by the Generate button)
    // --------------------------------------------------------
    @PostMapping(value = "/strategize", produces = "application/json")
    public String generateSpecificStrategy(@RequestBody Map<String, Object> requestPayload) {
        // In the future, you will read requestPayload.get("topic") and pass it to Z.ai here.
        // For now, we return this mocked response to test the React frontend.
        
        return """
            {
              "status": "success",
              "generatedPost": {
                "hook": "Stop doing this ONE thing if you want to grow...",
                "script": "Here is the exact strategy I use. Step 1: Analyze the trends. Step 2: Extract the data...",
                "visuals": "Fast cuts, text popping up on screen.",
                "audio": "Trending 'Pedro' Song (Safe for Commercial)",
                "caption": "Save this for later so you don't forget! 🚀 #growth",
                "complianceScore": "100%",
                "guardianWarning": "✓ Removed banned phrase 'link in bio' for TikTok compliance."
              }
            }
            """;
    }
}