package com.structify.application;

import com.structify.domain.Course;
import com.structify.domain.Lesson;
import com.structify.domain.PracticeProblem;
import com.structify.domain.VisualizationStep;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class LearningCatalogService {
    public List<Course> courses() {
        return List.of(
            new Course("foundation", "Foundation", "Foundation", "completed", 100, List.of()),
            new Course("complexity", "Complexity Analysis", "Foundation", "available", 62, List.of("foundation")),
            new Course("arrays", "Arrays", "Core", "available", 44, List.of("complexity")),
            new Course("interview", "Interview Preparation", "Interview", "locked", 0, List.of("dynamic-programming"))
        );
    }

    public Lesson lesson(String slug) {
        return new Lesson(
            slug,
            "Binary Search",
            "Arrays",
            "Find a value by repeatedly discarding half of a sorted search space.",
            List.of("Introduction", "Motivation", "Real-world examples", "Visualization", "Complexity Analysis", "Interactive Playground", "Code Examples", "Dry Run", "Quiz", "Practice Questions", "Interview Questions", "Summary", "Next Lesson"),
            List.of(
                new VisualizationStep("s1", "Start range", "The whole sorted array is possible.", List.of(0, 1, 2, 3, 4, 5, 6), List.of(2, 4, 7, 8, 12, 19, 31), 2),
                new VisualizationStep("s2", "Check middle", "Midpoint value 8 is smaller than 12, so the left half is removed.", List.of(3), List.of(2, 4, 7, 8, 12, 19, 31), 5)
            )
        );
    }

    public List<PracticeProblem> problems() {
        return List.of(
            new PracticeProblem("Search Insert Position", "Easy", "Binary Search", "Google", 72),
            new PracticeProblem("Course Schedule", "Medium", "Topological Sort", "Netflix", 48),
            new PracticeProblem("Minimum Window Substring", "Hard", "Hash + Window", "Uber", 42)
        );
    }
}
