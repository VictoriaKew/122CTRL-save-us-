package com.vic.hackathon.server;

import java.util.List;

public class ProjectResponse {
    public String hook;
    public String sonicDna;
    public String script;
    public List<StoryboardRow> storyboard;

    public ProjectResponse() {}

    public static class StoryboardRow {
        public int id;
        public String scene;
        public String character;
        public String shooting;
        public String editing;
        public String dialogue;
        public String duration;

        public StoryboardRow() {}
    }
}