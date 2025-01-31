import { Origin, TimelineStatus, VoteStatus } from "../types/properties";

export function getValidatedOrigin(origin: string | undefined): Origin {
    if (!origin) return  Origin.NoOriginInformationAvailable;

    if (Object.values(Origin).includes(origin as Origin)) {
      return origin as Origin;
    }
  
    // probably return NoOriginInformationAvailable here as well
    throw new Error(`Invalid origin: ${origin}`);
}

export function getValidatedStatus(status: string | undefined): TimelineStatus {
    if (!status) throw new Error("No VoteStatus found");            // probably return some default value, but this way we are not saying incorrect things

    if (Object.values(TimelineStatus).includes(status as TimelineStatus)) {
        return status as TimelineStatus;
    }

    throw new Error(`Invalid vote status: ${status}`);
}