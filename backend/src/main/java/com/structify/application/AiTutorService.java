package com.structify.application;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AiTutorService {
    private final String model;

    public AiTutorService(@Value("${structify.ai.model}") String model) {
        this.model = model;
    }

    public String hint(String concept, String currentStep) {
        if (concept.isBlank() || currentStep.isBlank()) {
            return "State the current invariant first, then ask for a focused hint.";
        }
        return "Hint from " + model + ": explain why this step preserves the invariant before moving forward.";
    }
}
