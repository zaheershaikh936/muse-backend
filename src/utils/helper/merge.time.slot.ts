import { AvailabilityT, TimeSlotT } from 'src/utils/types';

export function mergeTimeSlots(existing: TimeSlotT[], newSlots: TimeSlotT[]): TimeSlotT[] {
    const allSlots = [...existing, ...newSlots];

    // Sort slots by start time
    allSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));

    const mergedSlots: TimeSlotT[] = [];
    let currentSlot: TimeSlotT | null = null;

    for (const slot of allSlots) {
        if (!currentSlot) {
            currentSlot = { ...slot };
        } else if (slot.startTime <= currentSlot.endTime && slot.status === currentSlot.status) {
            // Merge overlapping slots with the same status
            currentSlot.endTime = slot.endTime > currentSlot.endTime ? slot.endTime : currentSlot.endTime;
            // Preserve the _id of the existing slot if it exists
            currentSlot._id = currentSlot._id || slot._id;
        } else {
            // Push the current slot and start a new one
            mergedSlots.push(currentSlot);
            currentSlot = { ...slot };
        }
    }

    if (currentSlot) {
        mergedSlots.push(currentSlot);
    }

    // Sort the final result by start time
    return mergedSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export function updateAvailability(obj1: AvailabilityT, obj2: { availability: AvailabilityT }): AvailabilityT {
    const result: AvailabilityT = { ...obj1 };

    for (const [day, newSlots] of Object.entries(obj2.availability)) {
        if (result[day]) {
            result[day] = mergeTimeSlots(result[day], newSlots);
        } else {
            result[day] = newSlots;
        }
    }

    return result;
}
