// Create types that automatically encode to JSON.

import Foundation

struct ScientificName: Codable {
    var genus: String
    var species: String
    var subspecies: String?
}

let momiji = ScientificName(genus: "Acer", species: "palmatum")
let jsonData = try JSONEncoder().encode(momiji)

// {"genus":"Acer","species":"palmatum"}
