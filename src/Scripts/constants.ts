// Defines the width of the net
export const netWidth = 10;
// Defines the height of the net
export const netHeight = 290;
// Just saves one operation
export const twoPi = 2 * Math.PI;
// Time of 1 logic step in ms
export const logicStep = 40;
// Number of time slices per iteration
export const timeSlices = 40;
// Sets the g factor
export const acceleration = 0.001875;
// The maximum amount of contacts per move
export const maxContacts = 3;
// The maximum (horizontal) speed of a player
export const maxSpeed = 0.4;
// The maximum (vertical) speed of a player
export const maxJump = 1.05;
// The (default) maximum number of points per set
export const defaultMaxPoints = 25;
// The (default) maximum number of sets per match
export const defaultMaxSets = 2;
// The time between two points in ms
export const pointBreakTime = 450;
// The time of the set won message display
export const setWonTime = 100;
// The start height of the ball in px
export const ballStartHeight = 250;
// Sets the acceleration of the ball through the player
export const ballSpeedup = 0.4;
// Sets the strength of the reflection of the ball while serving
export const ballLaunch = 1.5;
// Sets strength of the reflection of the ball
export const ballReflection = 0.8;
// Sets the air resistancy of the ball
export const ballResistance = 1;
// Sets the drag coefficient of the ball
export const ballDrag = 0.005;
// Sets the increase per iteration of pulse
export const pulseRecovery = 0.0004;
// Sets the decrease per iteration of pulse while running
export const pulseRunDecrease = 0.0005;
// Sets the decrease per iteration of pulse for jumping
export const pulseJumpDecrease = 0.17;
// Sets the size of the circles in the won-sets-display
export const setsWonRadius = 10;

export const beachNames = {
  'Rio de Janeiro': 'rio',
  Maldives: 'maldives',
  Orlando: 'orlando',
  'San Tropez': 'tropical',
  Mauritius: 'mauritius',
};

export const gameMessages = {
  Set: 'Set to {0}!',
  Start: 'GOOD LUCK!',
  Over: 'Winner... {0}!',
  Replay: 'Replay',
};
