# Design Guidelines: Voice-Activated Web OS with AI Assistant

## Design Approach
**Reference-Based Approach**: Drawing inspiration from Windows 11's desktop interface combined with Amazon Alexa's voice interaction patterns. This creates a familiar OS environment enhanced with modern voice-first AI capabilities.

## Core Design Elements

### A. Typography
- **Primary Font**: SF Pro Display (macOS) / Segoe UI (Windows)
- **Hierarchy**:
  - App titles: 14px semibold
  - Window headers: 13px medium
  - Body text: 12px regular
  - System taskbar: 11px regular
  - Voice assistant responses: 14px regular

### B. Layout System
**Spacing Units**: Use Tailwind units of 1, 2, 3, 4, 6, 8, 12 for consistent rhythm
- Desktop grid: Full viewport (100vh/100vw) fixed layout
- Taskbar: 48px height, fixed bottom
- Window padding: p-4 for content, p-3 for headers
- App icon grid: gap-4 spacing

### C. Component Library

**Desktop Shell**:
- Full-screen desktop background with subtle gradient overlay
- Fixed bottom taskbar with system tray, app launcher icons, and clock
- Centered voice assistant status indicator in taskbar

**Voice Assistant Interface**:
- Circular pulsing indicator (80px diameter) with animated blue rings during listening
- Floating voice response card with semi-transparent dark background (backdrop-blur)
- Microphone permission prompt overlay
- Voice wave visualization during speech recognition

**Window System**:
- Draggable floating windows with rounded corners (rounded-lg)
- Window chrome: 32px height header with title, minimize/maximize/close buttons
- Drop shadow (shadow-2xl) for depth
- Resizable windows with minimum dimensions (320x240px)
- Z-index stacking for focus management

**Built-in Applications**:
- File Manager: Tree view sidebar + file grid layout
- Settings: Two-column layout (sidebar navigation + content panel)
- Notes: Simple text editor with toolbar
- Calculator: Grid-based button layout

**App Icons**:
- 56px square icons with 8px rounded corners
- Icon + label layout (vertical stack)
- Hover state: subtle scale and brightness increase

**Voice Feedback Components**:
- Status toast notifications (top-right, 320px wide)
- Speech-to-text display overlay showing recognized commands
- AI response bubbles with typing animation

### D. Interaction Patterns

**Window Management**:
- Click-and-drag title bar to move windows
- Double-click title bar to maximize/restore
- Button interactions: 8px icon buttons with hover opacity change

**Voice Activation**:
- "Hey, Sagi" wake word triggers pulsing blue indicator
- Microphone active state: concentric animated rings
- Response state: gentle pulse with text-to-speech playback

**App Launching**:
- Click desktop icons or taskbar icons to open windows
- Windows open with subtle fade-in + scale animation (200ms)
- Multiple instances allowed for certain apps

## Visual Treatment

**Depth & Elevation**:
- Desktop: Base layer
- Windows: Elevated with shadow-2xl
- Active window: Additional glow effect using box-shadow with #00A0FF
- Taskbar: Fixed elevation with shadow-lg

**Voice Visual Feedback**:
- Listening: Pulsing concentric circles (0.8s animation loop)
- Processing: Spinning gradient ring
- Speaking: Synchronized audio wave visualization

**Glassmorphism Effects**:
- Window backgrounds: rgba(28, 28, 30, 0.85) with backdrop-blur-xl
- Voice assistant overlays: rgba(0, 160, 255, 0.1) with backdrop-blur-md
- Taskbar: rgba(35, 47, 62, 0.95) with backdrop-blur-sm

## Accessibility
- Voice indicator includes ARIA live regions for screen readers
- Keyboard shortcuts for window management (Alt+F4 to close, Win+D for desktop)
- Focus indicators visible on all interactive elements
- Transcription display for voice commands and responses

## Images
No traditional hero images needed - this is an application interface. Visual elements include:
- Desktop wallpaper: Abstract gradient or subtle geometric pattern
- App icons: Use icon library (Heroicons) for consistent system icons
- Voice assistant avatar: Circular gradient orb representing AI presence