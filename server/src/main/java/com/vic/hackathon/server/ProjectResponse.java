package com.vic.hackathon.server;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ProjectResponse {
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