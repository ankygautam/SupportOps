package com.supportops.backend.utils;

public final class QueryUtils {

    private QueryUtils() {
    }

    public static String normalizeSearch(String value) {
        return value == null ? "" : value.trim().toLowerCase();
    }

    public static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
