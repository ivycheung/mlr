import { FormSchemaPitch } from "../types/schemas/pitch-schema";

export function calculateDiff(pitch: FormSchemaPitch) {
    const difference = pitch.swing - pitch.pitch;
    return difference < 0 ? 1000 + difference : difference
}

export function calculateCircleDelta(pitch: FormSchemaPitch, previousPitch: FormSchemaPitch | null) {
    if (previousPitch == undefined || previousPitch == null) {
        return '-'
    }

    let delta = pitch.pitch - (previousPitch?.pitch ?? 0)
    if (delta > 500) {
        delta -= 1000
    } else if (delta < -500) {
        delta += 1000
    }

    return delta
}
export function getNextPitch(pitches: Array<FormSchemaPitch>, index: number) {
    return (pitches[index + 1] != undefined ? pitches[index + 1].pitch : '-');
}

export function getDelta(pitches: Array<FormSchemaPitch>, index: number) {
    const currentPitch = (pitches[index] != undefined ? pitches[index].pitch : null);
    const previousPitch = (pitches[index - 1] != undefined ? pitches[index - 1].pitch : null);

    if (currentPitch == undefined || currentPitch == null || previousPitch == undefined || previousPitch == null) {
        return '-';
    }
    else {
        return Math.abs(previousPitch - currentPitch);
    }
}