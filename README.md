# Earthquake Visualization

Visualizations incorporating geospatial data are used and analyzed in many different contexts, including navigating a city (as seen in GPS devices), commercial development, and setting governmental policy. This area also receives a significant amount of research attention. For example, Prof. Vipin Kumar and others at the University of Minnesota are working on visualizing and understanding global warming datasets as part of an [NSF project](http://climatechange.cs.umn.edu).

For this assignment, you will be working with data from NASA and the USGS to visualize on a globe the locations where earthquakes happened between 1905 and 2007.  Your application will be able to morph between two complementary views of the data, a 2D map view and a 3D globe view, as shown below. 

![](./images/sidebyside.png)

 In this assignment, you will learn to:

- Visualize real-world geographical data on a 3D textured globe.
- Apply textures to 3D objects.
- Algorithmically create a deforming 3D mesh and display it using vertex buffers.
- Define normal vectors and texture coordinates for a sphere.
- Convert from spherical coordinates (latitude and longitude) to 3D Cartesian coordinates.

You can try out the [instructor's implementation](https://csci-4611-spring-2023.github.io/Builds/Assignment-3) in the Builds repository on the course GitHub. 

## Prerequisites

To work with this code, you will first need to install [Node.js 18.13.0 LTS](https://nodejs.org/) and [Visual Studio Code](https://code.visualstudio.com/). 

## Getting Started

The starter code implements the general structure that we reviewed in lecture.  After cloning your repository, you will need to set up the initial project by pulling the dependencies from the node package manager with:

```
npm install
```

This will create a `node_modules` folder in your directory and download all the dependencies needed to run the project.  Note that this folder is listed in the `.gitignore` file and should not be committed to your repository.  After that, you can compile and run a server with:

```
npm run start
```

Your program should open in a web browser automatically.  If not, you can run it by pointing your browser at `http://localhost:8080`.

## Earth and Earthquake Data

We have included multiple scaled-down versions of this Earth texture with the code distributed on the website, since you need a fairly powerful computer to render even the lowest-quality image from the NASA page. In order of decreasing quality, the following images are provided:

- earth-2k.png: 2048×1024 version of image
- earth-1k.png: 1024×512 version of image
- earth-512.png: 512×256 version of image
- earth-256.png: 256×256 version of image

The [instructor's implementation](https://csci-4611-spring-2023.github.io/Builds/Assignment-3) uses the 2k version of the texture. If this runs slowly on your computer, you should feel free to use a lower resolution version of the image. The Earth textures are stored in a [equirectangular projection](https://en.wikipedia.org/wiki/Equirectangular_projection), which simply means that the *x* coordinate corresponds directly to longitude and *y* directly to latitude.

The earthquake dataset contains information about the earthquake's magnitude (a measure of severity) and its longitude and latitude. This data has already been loaded into `EarthquakeRecord` objects by the `EarthquakeDatabase` class.  You will be required to display the earthquakes at the correct locations with animations through time. More information on the earthquakes is available in the data file, and if you are interested in potential wizard ideas, you can try to figure out ways to integrate additional data variables into your visualization.


## Useful Math

Here are a few mathematical operations that are very common in graphics and may be useful for this assignment:

**Linear interpolation**: One way to blend smoothly between two values *x* and *y* (which could be reals, or vectors, or matrices, etc.) is to define a function in which the output varies continuously from *x* to *y* as a scalar parameter *alpha* goes from 0 to 1. This function is traditionally abbreviated "lerp."

- lerp(*x*, *y*, *alpha*) = *x* + *alpha* × (*y* − *x*)

Thus, for example:

- lerp(*x*, *y*, 0) = *x*

- lerp(*x*, *y*, 1) = *y*

- lerp(*x*, *y*, 0.5) = (*x* + *y*) / 2

GopherGfx provides `lerp()` functions for several of the built-in types, include scalars, vectors, and colors.  For example:

```typescript
// x, y, and alpha are numbers
result = gfx.MathUtils.lerp(x, y, alpha);

// vectors (this function modifies the calling object)
// x and y are Vector3, alpha is a number
someVector.lerp(x, y, alpha);

// colors (this function modifies the calling object)
// x and y are Color3, alpha is a number
someColor.lerp(x, y, alpha);
```

**Clamping**: A concise way to constrain a value to lie in a specified interval [*a*, *b*] is to define a function clamp(*x*, *a*, *b*) which returns *a* if *x* ≤ *a*, returns *b* if *x* ≥ *b*, and returns *x* otherwise.  GopherGfx conveniently provides a clamp function, which would be called as follows:

```typescript
x = gfx.MathUtils.clamp(x, a, b);
```

**Rescaling**: Suppose you have a value *x* in the range [*xmin*, *xmax*], and you want to find the corresponding value in [*ymin*, *ymax*]. Observe that *x* − *xmin* lies in [0, *xmax* − *xmin*], and (*x* − *xmin*)/(*xmax* − *xmin*) lies in [0, 1], so the desired value is:

- *y* = *ymin* + (*ymax* − *ymin*) × (*x* − *xmin*) / (*xmax* − *xmin*)

GopherGfx conveniently provides a rescale function, which would be called as follows:

```typescript
y = gfx.MathUtils.rescale(x, xmin, xmax, ymin, ymax);
```

Avalaible at:
```
https://csci-4611-spring-2023.github.io/your-repo-name-here
```


## Acknowledgments

Earthquake data was obtained from [USGS](http://earthquake.usgs.gov/). This data is in the public domain. Credit: U.S. Geological Survey Department of the Interior/USGS

The Earth texture was obtained from [NASA Visible Earth](http://visibleearth.nasa.gov/view_cat.php?categoryID=1484). This data is in the public domain. Credit: NASA Earth Observatory

The star background image was created by Jeremy Perkins on [Unsplash](https://unsplash.com/photos/uhjiu8FjnsQ).

This assignment was based on content from CSCI 4611 Fall 2021 by [Daniel Keefe](https://www.danielkeefe.net/).

## License

Material for [CSCI 4611 Spring 2023](https://csci-4611-fall-2022.github.io/) by [Evan Suma Rosenberg](https://illusioneering.umn.edu/) is licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-nc-sa/4.0/).
