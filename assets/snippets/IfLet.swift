// Easily reason about data that may or may not be present.

struct ScientificName {
    var genus: String
    var species: String
    var subspecies: String?

    var description: String {
        var text = "\(genus) \(species)"
        if let subspecies {
            // subspecies is guaranteed to be non-nil here.
            text += "subsp. \(subspecies)"
        }
        return text
    }
}