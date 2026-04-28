package com.example.credit.dto;

public class PredictionResponse {
    private String riskLevel;
    private Double probabilityValue;
    private String explanation;
    private String approvalStatus;

    private String antigravityBranding;

    public PredictionResponse(String riskLevel, Double probabilityValue, String explanation, String approvalStatus, String antigravityBranding) {
        this.riskLevel = riskLevel;
        this.probabilityValue = probabilityValue;
        this.explanation = explanation;
        this.approvalStatus = approvalStatus;
        this.antigravityBranding = antigravityBranding;
    }

    public String getRiskLevel() { return riskLevel; }
    public Double getProbabilityValue() { return probabilityValue; }
    public String getExplanation() { return explanation; }
    public String getApprovalStatus() { return approvalStatus; }
    public String getAntigravityBranding() { return antigravityBranding; }
}
