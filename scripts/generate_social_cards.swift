import AppKit

let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let output = root.appendingPathComponent("assets/images/social", isDirectory: true)
try FileManager.default.createDirectory(at: output, withIntermediateDirectories: true)

struct Card {
    let file: String
    let title: String
    let subtitle: String
    let icon: String?
    let screenshot: String?
    let colors: [NSColor]
}

let cards = [
    Card(file: "my-shift-planner.jpg", title: "Plan shifts. Track hours.\nEstimate pay.", subtitle: "Private shift planners for nursing and work schedules", icon: "assets/images/app-icon.png", screenshot: nil, colors: [NSColor(calibratedRed: 0.78, green: 0.92, blue: 0.89, alpha: 1), NSColor(calibratedRed: 0.90, green: 0.94, blue: 1.0, alpha: 1), NSColor(calibratedRed: 0.98, green: 0.90, blue: 0.88, alpha: 1)]),
    Card(file: "my-nurse-shift-planner.jpg", title: "Nurse shifts, hours\nand estimated pay", subtitle: "A private planner built for real nursing schedules", icon: "assets/images/app-icon.png", screenshot: "assets/images/localized/en/nurse-calendar-800.webp", colors: [NSColor(calibratedRed: 0.78, green: 0.92, blue: 0.89, alpha: 1), NSColor(calibratedRed: 0.96, green: 0.97, blue: 0.94, alpha: 1), NSColor(calibratedRed: 0.96, green: 0.87, blue: 0.84, alpha: 1)]),
    Card(file: "my-work-shift-planner.jpg", title: "Your work schedule,\nhours and pay", subtitle: "One private planner for every workplace", icon: "assets/images/workapp-icon.png", screenshot: "assets/images/work-1.png", colors: [NSColor(calibratedRed: 0.80, green: 0.88, blue: 1.0, alpha: 1), NSColor(calibratedRed: 0.94, green: 0.96, blue: 1.0, alpha: 1), NSColor(calibratedRed: 0.88, green: 0.91, blue: 0.99, alpha: 1)])
]

func font(_ size: CGFloat, _ weight: NSFont.Weight) -> NSFont {
    NSFont(name: "Avenir Next", size: size) ?? NSFont.systemFont(ofSize: size, weight: weight)
}

for card in cards {
    let width = 1200
    let height = 630
    guard let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: width, pixelsHigh: height, bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bitmapFormat: [], bytesPerRow: 0, bitsPerPixel: 0) else { continue }
    rep.size = NSSize(width: width, height: height)
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)

    NSGradient(colors: card.colors)?.draw(in: NSRect(x: 0, y: 0, width: width, height: height), angle: 10)
    NSColor.white.withAlphaComponent(0.22).setFill()
    NSBezierPath(ovalIn: NSRect(x: -120, y: 300, width: 500, height: 500)).fill()
    NSBezierPath(ovalIn: NSRect(x: 640, y: -180, width: 720, height: 720)).fill()

    if let screenshotPath = card.screenshot,
       let screenshot = NSImage(contentsOf: root.appendingPathComponent(screenshotPath)) {
        NSGraphicsContext.saveGraphicsState()
        let transform = NSAffineTransform()
        transform.translateX(by: 955, yBy: 306)
        transform.rotate(byDegrees: card.file.contains("work") ? -6 : 5)
        transform.translateX(by: -955, yBy: -306)
        transform.concat()
        if card.file.contains("work") {
            screenshot.draw(in: NSRect(x: 760, y: -175, width: 470, height: 757), from: .zero, operation: .sourceOver, fraction: 1)
        } else {
            let frame = NSRect(x: 825, y: -72, width: 330, height: 714)
            NSColor.white.withAlphaComponent(0.96).setFill()
            NSBezierPath(roundedRect: frame.insetBy(dx: -7, dy: -7), xRadius: 35, yRadius: 35).fill()
            let clip = NSBezierPath(roundedRect: frame, xRadius: 29, yRadius: 29)
            clip.addClip()
            screenshot.draw(in: frame, from: .zero, operation: .sourceOver, fraction: 1)
        }
        NSGraphicsContext.restoreGraphicsState()
    }

    if let iconPath = card.icon, let icon = NSImage(contentsOf: root.appendingPathComponent(iconPath)) {
        NSColor.white.withAlphaComponent(0.82).setFill()
        NSBezierPath(roundedRect: NSRect(x: 72, y: 464, width: 108, height: 108), xRadius: 29, yRadius: 29).fill()
        icon.draw(in: NSRect(x: 78, y: 470, width: 96, height: 96), from: .zero, operation: .sourceOver, fraction: 1)
    }

    let paragraph = NSMutableParagraphStyle()
    paragraph.lineSpacing = 2
    let titleAttributes: [NSAttributedString.Key: Any] = [.font: font(55, .bold), .foregroundColor: NSColor(calibratedRed: 0.07, green: 0.16, blue: 0.20, alpha: 1), .paragraphStyle: paragraph]
    let subtitleAttributes: [NSAttributedString.Key: Any] = [.font: font(24, .medium), .foregroundColor: NSColor(calibratedRed: 0.27, green: 0.39, blue: 0.44, alpha: 1)]
    let titleRect = NSRect(x: 72, y: 220, width: card.screenshot == nil ? 930 : 700, height: 220)
    NSString(string: card.title).draw(in: titleRect, withAttributes: titleAttributes)
    NSString(string: card.subtitle).draw(in: NSRect(x: 75, y: 145, width: card.screenshot == nil ? 900 : 680, height: 70), withAttributes: subtitleAttributes)
    NSString(string: "myshiftplanner.app").draw(in: NSRect(x: 75, y: 72, width: 520, height: 42), withAttributes: [.font: font(20, .semibold), .foregroundColor: NSColor(calibratedRed: 0.20, green: 0.49, blue: 0.51, alpha: 1)])

    NSGraphicsContext.restoreGraphicsState()
    if let data = rep.representation(using: .jpeg, properties: [.compressionFactor: 0.9]) {
        try data.write(to: output.appendingPathComponent(card.file))
    }
}
