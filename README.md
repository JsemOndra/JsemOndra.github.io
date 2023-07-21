# Mapitko - Simple Object Locator App

![Mapitko Screenshot](https://github.com/JsemOndra/mapitko.github.io/assets/6908554/2cbf7db9-c312-4381-a899-285ecdeac7fb)

Mapitko is a simple web app that helps you locate distant objects on a map using basic triangulation. You can input different positions and their azimuth angles to find the location of the object.

## How to Use

- Go to [Mapitko App](https://jsemondra.github.io/mapitko/mapitko.html).
![Or scan this QR](https://github.com/JsemOndra/mapitko/assets/6908554/45820c05-435b-4de0-9f18-ee00d20c2efc)
- Fill Your Position and Azimuth Towards the Object in Respective Fields.

- Allowed Formats for "Your Position":
  - 50°21'12"N 10°12'55"E or 50.1109221 8.6821267 - These formats are good enough for my needs. Feel free to contribute with code to handle more formats.

- Enter the Distance to Which the Line Should Be Drawn (Default is 30km) and an Optional Note.

- Click on the "Save Point" Button to Save the Location From Where You Want to Locate the Object.

- The App Will Calculate and Display the Vector/Line on the Map Based on the Entered Position and Azimuth Angles.
- Enter additional lines from distant places, all pointing to the same object, to obtain a more accurate result.
- _You Can Use Your Device's Location Services to fill GPS Coordinates to appropriate field._
  


## Features

- Add multiple positions along with their respective azimuth angles.
- Triangulate the location of the object on the map using the entered positions.
- Saves Points do browser local storage
- Points import/export

## Development

Mapitko is built using HTML, CSS, and JavaScript. The app uses basic trigonometry to perform triangulation calculations.

## Running Locally

To run Mapitko locally on your machine, simply clone this GitHub repository and open the `mapitko.html` file in your web browser.

```bash
git clone https://github.com/jsemondra/mapitko.git
cd mapitko
open mapitko.html
```

## Contributing
If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request on GitHub.

## License
Mapitko is released under the [MIT License](https://en.wikipedia.org/wiki/MIT_License). Feel free to use and modify it as per your needs.


