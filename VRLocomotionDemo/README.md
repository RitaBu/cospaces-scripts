# Locomotion Demo (Teleport Markers)

>"Ice Skaters" stage originally created by Susanne, retrofitted with additional teleport markers for VR. 
Features highlight animation and dynamic fadeIn/fadeOut of markers depending on player gaze

>Intent of this demo is to showcase a locomotion (movement) system commonly used for VR. 
Recurring problems with VR navigation are long waiting times due to slow camera movement as well as 
-too much- freedom of exploration when walking in VR. Teleport markers allow creators to limit user exploration to pre-defined,
polished locations while preventing players to trail off.

## Project location
Currently in studio.CoSpaces:
[https://cospac.es/vwZd](https://cospac.es/vwZd)

## How to use

1. Look around the stage
2. Click on markers to switch position

## Locomotion Info (vr research related)
>Early Unity prototypes included fading Out/In of the camera when teleportation happened. While it is the most comfortable solution to teleport the player
from A to B it interrupts  visual flow, leading to occasional disorientation. 

>The current locomotion solution is a quick moveLinear() for half a second: fast enough for the brain to skip noticing acceleration and decceleration,
which mitigates triggering VR/Cyber/Motion sickness.

## Things to try:
>Give markers automatically/manually IDs (numbers) for guided tours?
>>Chronologically follow markers by numbers (make others unavailable until it's their turn?)

>>Unique markers to change spaces or load in entirely different projects?