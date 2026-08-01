package com.structify.domain;

import java.util.List;

public record Course(String id, String title, String level, String status, int progress, List<String> prerequisites) {}
