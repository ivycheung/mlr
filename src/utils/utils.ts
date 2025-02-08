import { FormSchemaPitch } from "../types/schemas/pitch-schema";

export function calculateDiff(pitch: FormSchemaPitch) {
    const difference = pitch.swing - pitch.pitch;
    return difference < 0 ? 1000 + difference : difference
}

export function calculateDelta(pitch: FormSchemaPitch, previousPitch: FormSchemaPitch | null) {
    const delta = pitch.pitch - (previousPitch?.pitch ?? 0)
    return delta < 0 ? 1000 + delta : delta

}

export function calculateCircleDelta(pitch: FormSchemaPitch, previousPitch: FormSchemaPitch | null) {
    let delta = pitch.pitch - (previousPitch?.pitch ?? 0)
    if (delta > 500) {
        delta -= 1000
    } else if (delta < -500) {
        delta += 1000
    }

    return delta
}

export function calculateHistogram(pitches: Array<FormSchemaPitch>, bucketSize: number) {
    const bins = Array.from({ length: Math.ceil(1000 / bucketSize) }, () => 0); // initialize bins
    pitches.forEach((pitch) => {
        if (pitch.pitch >= 1 && pitch.pitch <= 1000) {
            const index = Math.floor((pitch.pitch - 1) / bucketSize); // Calculate which bucket this number falls into
            bins[index]++;
        }
    });

    return bins;
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