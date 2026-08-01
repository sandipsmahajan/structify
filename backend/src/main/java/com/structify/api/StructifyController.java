package com.structify.api;

import com.structify.application.AiTutorService;
import com.structify.application.LearningCatalogService;
import com.structify.domain.Course;
import com.structify.domain.Lesson;
import com.structify.domain.PracticeProblem;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Map;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api")
public class StructifyController {
    private final LearningCatalogService catalog;
    private final AiTutorService tutor;

    public StructifyController(LearningCatalogService catalog, AiTutorService tutor) {
        this.catalog = catalog;
        this.tutor = tutor;
    }

    @GetMapping("/courses")
    public List<Course> courses() {
        return catalog.courses();
    }

    @GetMapping("/lessons/{slug}")
    public Lesson lesson(@PathVariable String slug) {
        return catalog.lesson(slug);
    }

    @GetMapping("/problems")
    public List<PracticeProblem> problems() {
        return catalog.problems();
    }

    @PostMapping("/auth/login")
    public Map<String, String> login(@RequestBody LoginRequest request) {
        return Map.of("token", "development-jwt-placeholder", "email", request.email());
    }

    @PostMapping("/ai/hint")
    public Map<String, String> hint(@RequestBody HintRequest request) {
        return Map.of("hint", tutor.hint(request.concept(), request.currentStep()));
    }

    @PostMapping("/progress/complete")
    public Map<String, Object> complete(@RequestBody ProgressRequest request) {
        return Map.of("lesson", request.lessonSlug(), "completed", true, "xpAwarded", request.xp());
    }

    public record LoginRequest(@Email String email, @NotBlank String password) {}
    public record HintRequest(@NotBlank String concept, @NotBlank String currentStep) {}
    public record ProgressRequest(@NotBlank String lessonSlug, int xp) {}
}
