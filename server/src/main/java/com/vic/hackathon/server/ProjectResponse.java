package com.vic.hackathon.server;

import java.util.List;

/**
 * Data Transfer Object for Buddy Agent projects.
 * Located in the same package as AgentController.
 */
public class ProjectResponse {
    public String hook;
    public String sonicDna;
    public String script;
    public List<StoryboardRow> storyboard;

    // --- CRITICAL: Default Constructor for Jackson ---
    public ProjectResponse() {}

    public static class StoryboardRow {
        public int id;
        public String scene;
        public String character;
        public String shooting;
        public String editing;
        public String dialogue;
        public String duration;

        // --- CRITICAL: Default Constructor for Jackson ---
        public StoryboardRow() {}
    }
}