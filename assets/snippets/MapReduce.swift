// Use functional programming techniques.

import Foundation

func squareWave(phase: Float, overtones: UInt) -> Float {
    return (0...overtones)
        .map {
            let harmonic = Float($0 * 2 + 1)
            return sinf(phase * harmonic) / harmonic
        }
        .reduce(0, +)
}