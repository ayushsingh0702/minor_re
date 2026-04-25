package com.example.credit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
/*  */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PredictionController {

    @Autowired
    private PredictionRepository predictionRepository;

    private RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/predict")
    public Map<String, Object> predict(@RequestBody Map<String, Object> payload) {
        String flaskUrl = "http://localhost:5000/predict";

        Map<String, Object> flaskRequest = new HashMap<>();
        flaskRequest.put("age", payload.get("age"));
        flaskRequest.put("income", payload.get("income"));
        flaskRequest.put("credit_score", payload.get("credit_score"));
        flaskRequest.put("loan_amount", payload.get("loan_amount"));

        ResponseEntity<Map> response = restTemplate.postForEntity(flaskUrl, flaskRequest, Map.class);
        Map body = response.getBody();

        Integer predictionValue = (Integer) body.get("prediction");
        Double probabilityValue = ((Number) body.get("probability")).doubleValue();

        Prediction p = new Prediction(
                ((Number) payload.get("age")).intValue(),
                ((Number) payload.get("income")).doubleValue(),
                ((Number) payload.get("credit_score")).intValue(),
                ((Number) payload.get("loan_amount")).doubleValue(),
                predictionValue,
                probabilityValue,
                LocalDateTime.now()
        );
        predictionRepository.save(p);

        Map<String, Object> result = new HashMap<>();
        result.put("prediction", predictionValue);
        result.put("probability", probabilityValue);
        return result;
    }

    @GetMapping("/history")
    public List<Prediction> history() {
        return predictionRepository.findAll();
    }
}
