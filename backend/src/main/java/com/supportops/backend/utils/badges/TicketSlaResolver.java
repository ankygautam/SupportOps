package com.supportops.backend.utils.badges;

import com.supportops.backend.entity.SlaRecord;
import com.supportops.backend.enums.SlaState;

public final class TicketSlaResolver {

    private TicketSlaResolver() {
    }

    public static SlaState resolve(SlaRecord slaRecord) {
        if (slaRecord == null) {
            return SlaState.ON_TRACK;
        }

        return slaRecord.getState();
    }
}
