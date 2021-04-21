
// Array.from(Array(360/5)).map((_,i) => i * 5).map(d => `    _${d}: ${(d / 180) * Math.PI},`).join("\n")

export const rads = {
    _0: 0,
    _5: 0.08726646259971647,
    _10: 0.17453292519943295,
    _15: 0.2617993877991494,
    _20: 0.3490658503988659,
    _25: 0.4363323129985824,
    _30: 0.5235987755982988,
    _35: 0.6108652381980153,
    _40: 0.6981317007977318,
    _45: 0.7853981633974483,
    _50: 0.8726646259971648,
    _55: 0.9599310885968813,
    _60: 1.0471975511965976,
    _65: 1.1344640137963142,
    _70: 1.2217304763960306,
    _75: 1.3089969389957472,
    _80: 1.3962634015954636,
    _85: 1.48352986419518,
    _90: 1.5707963267948966,
    _95: 1.6580627893946132,
    _100: 1.7453292519943295,
    _105: 1.8325957145940461,
    _110: 1.9198621771937625,
    _115: 2.007128639793479,
    _120: 2.0943951023931953,
    _125: 2.1816615649929116,
    _130: 2.2689280275926285,
    _135: 2.356194490192345,
    _140: 2.443460952792061,
    _145: 2.530727415391778,
    _150: 2.6179938779914944,
    _155: 2.705260340591211,
    _160: 2.792526803190927,
    _165: 2.8797932657906435,
    _170: 2.96705972839036,
    _175: 3.0543261909900767,
    _180: 3.141592653589793,
    _185: 3.2288591161895095,
    _190: 3.3161255787892263,
    _195: 3.4033920413889422,
    _200: 3.490658503988659,
    _205: 3.5779249665883754,
    _210: 3.6651914291880923,
    _215: 3.752457891787808,
    _220: 3.839724354387525,
    _225: 3.9269908169872414,
    _230: 4.014257279586958,
    _235: 4.101523742186674,
    _240: 4.1887902047863905,
    _245: 4.276056667386108,
    _250: 4.363323129985823,
    _255: 4.4505895925855405,
    _260: 4.537856055185257,
    _265: 4.625122517784973,
    _270: 4.71238898038469,
    _275: 4.799655442984406,
    _280: 4.886921905584122,
    _285: 4.974188368183839,
    _290: 5.061454830783556,
    _295: 5.148721293383272,
    _300: 5.235987755982989,
    _305: 5.323254218582705,
    _310: 5.410520681182422,
    _315: 5.497787143782138,
    _320: 5.585053606381854,
    _325: 5.672320068981571,
    _330: 5.759586531581287,
    _335: 5.846852994181004,
    _340: 5.93411945678072,
    _345: 6.021385919380437,
    _350: 6.1086523819801535,
    _355: 6.19591884457987,
}



// from: https://stackoverflow.com/a/9614122/539490
// Return -Pi < x <= Pi
export function get_angle (cx: number, cy: number, ex: number, ey: number)
{
    const dy = ey - cy
    const dx = ex - cx
    let theta = Math.atan2(dy, dx)  // range (-PI, PI]
    // theta *= 180 / Math.PI  // rads to degs, range (-180, 180]
    // if (theta < 0) theta = 360 + theta  // range [0, 360)
    return theta
}



// https://stackoverflow.com/questions/24234609/standard-way-to-normalize-an-angle-to-%CF%80-radians-in-java
const normalise_angle = normalise_angle_between_neg_Pi_and_Pi
const TWO_PI = Math.PI * 2
// Return x normalised to: -Pi < x <= Pi
export function normalise_angle_between_neg_Pi_and_Pi (angle: number)
{
    return angle + TWO_PI * Math.floor((Math.PI - angle) / TWO_PI)
}
