## Design Goal

The objective of this project is to create an interactive visualization tool that maps emotional states onto Plutchik's Wheel of Emotions, allowing users to physically explore and mark their current mood through real-time joystick, potentiometer, and button controls. 

<p>
    <img src="https://github.com/user-attachments/assets/efc85615-8da4-4641-ba01-e53c47323840" alt>
    <em>Collected emotions from students after project showcase</em>
</p>


## Material used

- ESP32 microcontroller
- Joystick
- Potentiometer
- Button
- Jumper wires and breadboard for connections
- USB cable
- 3D Printing for enclosure (optional)

## Instruction

### Hardware

1. Follow the Fritzing diagram under `assets/emotions-wheel-fritzing.fzz` to set up the breadboard
2. Make sure that:
    - Button is connected to Pin `2`
    - The divider of the potentiometer is connected to Pin `13`
    - Joystick:
        - VRX is connected to `39`
        - VRY is connected to `32`
        - SW is connected to `33`
3. Connect ESP32 using a USB cable to the laptop
4. 3D Printing enclosure for joystick (optional)
    - The two STL files for joystick enclosure can be found in the `assets` folder
    - This project used Ultimaker 2+ to 3D print the enclosure (approximately 3-4 hours)
    - Assembly:
        - Use Double Sided Nano tape to fix the joystick board at the center of the bottom enclosure
        - Use any liquid glue to assemble the two parts together

### Programming

1. Upload the `read-data-from-components.ino` code to ESP32, which collects sensor data from the three components and sends it over a serial connection to the laptop.
2. Data visualization via Web Serial
    - Download or clone this github repo
    - Open `index.html` using Chrome
    - Click the “Serial Connect” button to select the port
    - Feel free to adjust the code (e.g. font style, background color, cursor size)

### Play & Mark your emotion!

happy coding :p

![emotions-wheel](https://github.com/user-attachments/assets/6ab929c9-4abf-4073-986c-f9f70166b444)

Demo: https://youtu.be/x2vC-KoeSZ4
