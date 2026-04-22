package com.vic.hackathon.server;
import java.util.List;

public class ComplianceResponse {
    public int score;
    public List<ComplianceIssue> issues;

    // REQUIRED: Empty constructor
    public ComplianceResponse() {} 

    public static class ComplianceIssue {
        public String type;
        public String platform;
        public String title;
        public String desc;

        // REQUIRED: Empty constructor
        public ComplianceIssue() {}

        public ComplianceIssue(String type, String platform, String title, String desc) {
            this.type = type;
            this.platform = platform;
            this.title = title;
            this.desc = desc;
        }
    }
}