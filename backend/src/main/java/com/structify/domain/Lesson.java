package com.structify.domain;

import java.util.List;

public record Lesson(String slug, String title, String course, String summary, List<String> sections, List<VisualizationStep> visualization) {}
