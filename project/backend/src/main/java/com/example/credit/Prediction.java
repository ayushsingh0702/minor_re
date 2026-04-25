package com.example.credit;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer age;
    private Double income;
    private Integer creditScore;
    private Double loanAmount;
    private Integer prediction;
    private Double probability;
    private LocalDateTime timestamp;

    public Prediction() {}

    public Prediction(Integer age, Double income, Integer creditScore,
                      Double loanAmount, Integer prediction, Double probability,
                      LocalDateTime timestamp) {
        this.age = age;
        this.income = income;
        this.creditScore = creditScore;
        this.loanAmount = loanAmount;
        this.prediction = prediction;
        this.probability = probability;
        this.timestamp = timestamp;
    }

    public Long getId() { return id; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public Double getIncome() { return income; }
    public void setIncome(Double income) { this.income = income; }
    public Integer getCreditScore() { return creditScore; }
    public void setCreditScore(Integer creditScore) { this.creditScore = creditScore; }
    public Double getLoanAmount() { return loanAmount; }
    public void setLoanAmount(Double loanAmount) { this.loanAmount = loanAmount; }
    public Integer getPrediction() { return prediction; }
    public void setPrediction(Integer prediction) { this.prediction = prediction; }
    public Double getProbability() { return probability; }
    public void setProbability(Double probability) { this.probability = probability; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
