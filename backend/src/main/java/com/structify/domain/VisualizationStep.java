package com.structify.domain;

import java.util.List;

public record VisualizationStep(String id, String label, String explanation, List<Integer> activeIndexes, List<Integer> values, int codeLine) {}
