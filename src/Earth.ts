/* Assignment 3: Earthquake Visualization
 * CSCI 4611, Spring 2023, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as gfx from 'gophergfx'
import { EarthquakeMarker } from './EarthquakeMarker';
import { EarthquakeRecord } from './EarthquakeRecord';

export class Earth extends gfx.Transform3
{
    private earthMesh: gfx.MorphMesh;

    public globeMode: boolean;

    constructor()
    {
        // Call the superclass constructor
        super();

        this.earthMesh = new gfx.MorphMesh();

        this.globeMode = false;
    }

    public createMesh() : void
    {
        // Initialize texture: you can change to a lower-res texture here if needed
        // Note that this won't display properly until you assign texture coordinates to the mesh
        this.earthMesh.material.texture = new gfx.Texture('./assets/earth-2k.png');
        
        // This disables mipmapping, which makes the texture appear sharper
        this.earthMesh.material.texture.setMinFilter(true, false);   

        // You can use this variable to define the resolution of your flat map and globe map
        // using a nested loop. 20x20 is reasonable for a good looking sphere, and you don't
        // need to change this constant to complete the base assignment  However,if you want 
        // to use height map or bathymetry data for a wizard bonus, you might need to increase
        // the mesh resolution to get better results.
        const meshResolution = 20;
        
        // Precalculated vertices and normals for the earth plane mesh.
        // After we compute them, we can store them directly in the earthMesh,
        // so they don't need to be member variables.
        const mapVertices: gfx.Vector3[] = [];
        const mapNormals: gfx.Vector3[] = [];

        // Part 1: Creating the Flat Map Mesh
        // As a demo, we'll add an rectangle with two triangles.
        // First, we define four vertices at each corner of the earth
        // in latitude and longitude and convert to the coordinates
        // used for the flat map.
        const xIncrement = (360) / meshResolution;
        const yIncrement = (180) / meshResolution;

        const texCoords: number[] = [];

        for(let r=0; r <= meshResolution; r++)
        {
            for(let c=0; c <= meshResolution; c++)
            {
                // start from upper left, add vertexes col by col, row by row
                const vertex = this.convertLatLongToPlane( (90 - (r * yIncrement)) , (-180 + (c * xIncrement)) );
                mapVertices.push(vertex);
                mapNormals.push(gfx.Vector3.BACK);

                // textCoords need to be converted to 0-1 range
                texCoords.push( c/meshResolution, r/meshResolution);                 
            }
        }

        const indices: number[] = [];
        for(let r=0; r < meshResolution; r++)
        {
            for(let c=0; c < meshResolution; c++)
            {
                const upperLeftIndex = (meshResolution+1) * r + c;   
                const upperRightIndex = upperLeftIndex + 1;
                const lowerLeftIndex = upperRightIndex + meshResolution;  
                const lowerRightIndex = lowerLeftIndex + 1;
                
                indices.push(upperLeftIndex, lowerRightIndex, upperRightIndex);

                indices.push(lowerRightIndex, upperLeftIndex, lowerLeftIndex);
            }

        }


        // mapVertices.push(this.convertLatLongToPlane(-90, -180)); // lower left
        // mapVertices.push(this.convertLatLongToPlane(-90, 180)); // lower right
        // mapVertices.push(this.convertLatLongToPlane(90, 180)); // upper right
        // mapVertices.push(this.convertLatLongToPlane(90, -180)); // upper left

        // // The flat map normals are always directly outward towards the camera
        // mapNormals.push(gfx.Vector3.BACK);
        // mapNormals.push(gfx.Vector3.BACK);
        // mapNormals.push(gfx.Vector3.BACK);
        // mapNormals.push(gfx.Vector3.BACK);

        // Define indices into the array for the two triangles
        //const indices: number[] = [];
        // indices.push(0, 1, 2); // bottom left triangle
        // indices.push(0, 2, 3); // bottom right triangle

        // Part 2: Texturing the Mesh
        // Again, you should replace the example code below
        // with texture coordinates for the earth mesh.
        //const texCoords: number[] = [];
        // texCoords.push(0, 0);
        // texCoords.push(1, 0);
        // texCoords.push(0, 1);
        // texCoords.push(1, 1);

        // Set all the earth mesh data
        this.earthMesh.setVertices(mapVertices, true);
        this.earthMesh.setNormals(mapNormals, true);
        this.earthMesh.setIndices(indices);
        this.earthMesh.setTextureCoordinates(texCoords);
        this.earthMesh.createDefaultVertexColors();

        // Part 3: Creating the Globe Mesh
        // You should compute a new set of vertices and normals
        // for the globe. You will need to also add code in
        // the convertLatLongToSphere() method below.

        const sphereVertices: gfx.Vector3[] = [];
        const sphereNormals: gfx.Vector3[] = [];

        for(let r=0; r < meshResolution; r++)
        {
            for(let c=0; c <= meshResolution; c++)
            {
                const vertex = this.convertLatLongToSphere( ( 90 - (r* yIncrement)) , (-180 + (c * xIncrement)) );
                   
                const centerOfGlobe = new gfx.Vector3(0, 0, 0);
                const normal = vertex.clone();
                normal.subtract(centerOfGlobe);
                normal.normalize();

                sphereVertices.push(vertex);
                sphereNormals.push(normal);
            }
        }

        this.earthMesh.setMorphTargetVertices(sphereVertices);
        this.earthMesh.setMorphTargetNormals(sphereNormals);

        // Add the mesh to this group
        this.add(this.earthMesh);
    }

    public update(deltaTime: number) : void
    {
        // Part 4: Morphing Between the Map and Globe
        // The value of this.globeMode will be changed whenever
        // the user selects flat map or globe mode in the GUI.
        // You should use this boolean to control the morphing
        // of the earth mesh, as described in the readme.
        if(this.globeMode){
            if(this.earthMesh.morphAlpha < 1){
                this.earthMesh.morphAlpha += deltaTime;
            }
        }
        else{
            if(this.earthMesh.morphAlpha > 0){
                this.earthMesh.morphAlpha -= deltaTime;
            }
        }        
    }

    public createEarthquake(record: EarthquakeRecord)
    {
        // Number of milliseconds in 1 year (approx.)
        const duration = 12 * 28 * 24 * 60 * 60;

        // Part 5: Creating the Earthquake Markers
        // Currently, the earthquake is just placed randomly
        // on the plane. You will need to update this code to
        // correctly calculate both the map and globe positions.
        const mapPosition = this.convertLatLongToPlane(record.latitude, record.longitude);
        const globePosition = this.convertLatLongToSphere(record.latitude, record.longitude);

        const earthquake = new EarthquakeMarker(mapPosition, globePosition, record, duration);

        // Global adjustment to reduce the size. You should probably
        // update this be a more meaningful representation..
        if(earthquake.magnitude <= 0.25){ 
            earthquake.scale.set(0.15, 0.15, 0.15);
            earthquake.material.setColor(new gfx.Color(255/255, 255/255, 3/255));
        }
        else if(earthquake.magnitude > 0.25 && earthquake.magnitude <= 0.5){
            earthquake.scale.set(0.3, 0.3, 0.3);
            earthquake.material.setColor(new gfx.Color(255/255, 146/255, 3/255));
        }
        else{ 
            earthquake.scale.set(0.5, 0.5, 0.5);
            earthquake.material.setColor(new gfx.Color(255/255, 3/255, 3/255));
        }


        // Uncomment this line of code to active the earthquake markers
        this.add(earthquake);
    }

    public animateEarthquakes(currentTime : number)
    {
        // This code removes earthquake markers after their life has expired
        this.children.forEach((quake: gfx.Transform3) => {
            if(quake instanceof EarthquakeMarker)
            {
                const playbackLife = (quake as EarthquakeMarker).getPlaybackLife(currentTime);

                // The earthquake has exceeded its lifespan and should be moved from the scene
                if(playbackLife >= 1)
                {
                    quake.remove();
                }
                // The earthquake positions should be updated
                else
                {
                    // Part 6: Morphing the Earthquake Positions
                    // If you have correctly computed the flat map and globe positions
                    // for each earthquake marker in part 5, then you can simply lerp
                    // between them using the same alpha as the earth mesh.
                    quake.position.lerp(quake.mapPosition, quake.globePosition, this.earthMesh.morphAlpha);
                }
            }
        });
    }

    // This convenience method converts from latitude and longitude (in degrees) to a Vector3 object
    // in the flat map coordinate system described in the readme.
    public convertLatLongToPlane(latitude: number, longitude: number): gfx.Vector3
    {
        return new gfx.Vector3(longitude * Math.PI / 180, latitude * Math.PI / 180, 0);
    }

    // This convenience method converts from latitude and longitude (in degrees) to a Vector3 object
    // in the globe mesh map coordinate system described in the readme.
    public convertLatLongToSphere(latitude: number, longitude: number): gfx.Vector3
    {
        // Part 3: Creating the Globe Mesh
        // Add code here to correctly compute the 3D sphere position
        // based on latitude and longitude.
        return new gfx.Vector3( (Math.cos(latitude * Math.PI/180) * Math.sin(longitude * Math.PI/180)), Math.sin(latitude * Math.PI/180), 
            (Math.cos(latitude * Math.PI/180) * Math.cos(longitude * Math.PI/180)) );
    }

    // This function toggles the wireframe debug mode on and off
    public toggleDebugMode(debugMode : boolean)
    {
        this.earthMesh.material.wireframe = debugMode;
    }
}