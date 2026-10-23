//src/components/three/models.js
import * as THREE from "three";

/* Small low-poly models shared by the hero scene and the home page service
   cards. Everything is built from primitives, so there are no model files to
   download. Each builder returns a THREE.Group sitting on y = 0. */

const lambert = (color, extra = {}) =>
  new THREE.MeshLambertMaterial({ color, flatShading: true, ...extra });

function adder(parent) {
  return (geo, mat, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  };
}

export function buildJeep() {
  const g = new THREE.Group();
  const body = new THREE.MeshLambertMaterial({ color: 0xd9402a, flatShading: true });
  const dark = new THREE.MeshLambertMaterial({ color: 0x1b1f1d, flatShading: true });
  const tire = new THREE.MeshLambertMaterial({ color: 0x141414 });
  const glass = new THREE.MeshLambertMaterial({
    color: 0xbfe3ee,
    transparent: true,
    opacity: 0.55,
  });
  const tail = new THREE.MeshBasicMaterial({ color: 0xff3b30 });
  const lamp = new THREE.MeshBasicMaterial({ color: 0xfff1b8 });

  const add = (geo, mat, x, y, z, parent = g) => {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  };

  // body — front of the jeep points toward -z
  add(new THREE.BoxGeometry(1.9, 0.75, 3.6), body, 0, 0.95, 0);
  add(new THREE.BoxGeometry(1.8, 0.4, 1.1), body, 0, 1.4, -1.25); // hood
  add(new THREE.BoxGeometry(1.85, 0.1, 3.5), dark, 0, 0.55, 0); // skid plate

  // windshield
  const ws = add(new THREE.BoxGeometry(1.7, 0.85, 0.06), glass, 0, 1.85, -0.65);
  ws.rotation.x = -0.28;

  // roll cage
  const post = new THREE.CylinderGeometry(0.05, 0.05, 1.25, 6);
  [
    [-0.85, -0.6],
    [0.85, -0.6],
    [-0.85, 1.55],
    [0.85, 1.55],
  ].forEach(([x, z]) => add(post, dark, x, 2.0, z));
  add(new THREE.BoxGeometry(1.8, 0.07, 0.07), dark, 0, 2.62, -0.6);
  add(new THREE.BoxGeometry(1.8, 0.07, 0.07), dark, 0, 2.62, 1.55);
  add(new THREE.BoxGeometry(0.07, 0.07, 2.2), dark, -0.85, 2.62, 0.48);
  add(new THREE.BoxGeometry(0.07, 0.07, 2.2), dark, 0.85, 2.62, 0.48);

  // seats + guests
  add(new THREE.BoxGeometry(1.6, 0.18, 0.55), dark, 0, 1.4, 0.0);
  add(new THREE.BoxGeometry(1.6, 0.18, 0.55), dark, 0, 1.4, 1.1);
  const skin = new THREE.MeshLambertMaterial({ color: 0xc58c5e });
  const shirts = [0x2f6fa5, 0xf2c14e, 0xe86a92];
  [-0.5, 0.05, 0.55].forEach((x, i) => {
    const shirt = new THREE.MeshLambertMaterial({ color: shirts[i] });
    add(new THREE.BoxGeometry(0.42, 0.55, 0.3), shirt, x, 1.85, 0.05);
    add(new THREE.SphereGeometry(0.2, 8, 8), skin, x, 2.3, 0.05);
  });

  // lights
  [-0.65, 0.65].forEach((x) => {
    add(new THREE.CylinderGeometry(0.15, 0.15, 0.12, 8).rotateX(Math.PI / 2), lamp, x, 1.35, -1.83);
    add(new THREE.BoxGeometry(0.25, 0.14, 0.06), tail, x, 1.1, 1.82);
  });

  // spare wheel
  const spare = add(new THREE.CylinderGeometry(0.5, 0.5, 0.25, 12).rotateX(Math.PI / 2), tire, 0, 1.25, 1.95);
  spare.rotation.z = 0;

  // wheels (geometry axis along x so rotation.x spins them)
  const wheelGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.42, 14).rotateZ(Math.PI / 2);
  const wheels = [];
  [
    [-1.02, -1.2],
    [1.02, -1.2],
    [-1.02, 1.2],
    [1.02, 1.2],
  ].forEach(([x, z]) => wheels.push(add(wheelGeo, tire, x, 0.55, z)));

  g.userData.wheels = wheels;
  return g;
}

/* DSLR camera, lens pointing toward +z */
export function buildCamera() {
  const g = new THREE.Group();
  const add = adder(g);
  const dark = lambert(0x262a28);
  const darker = lambert(0x161918);
  const silver = lambert(0xcfd3d0);
  const amber = new THREE.MeshBasicMaterial({ color: 0xf4a63a });
  const glass = new THREE.MeshLambertMaterial({ color: 0x2e5f9a, emissive: 0x0d2540 });

  add(new THREE.BoxGeometry(2.6, 1.55, 1.3), dark, 0, 1.2, 0); // body
  add(new THREE.BoxGeometry(2.62, 0.32, 1.32), silver, 0, 2.1, 0); // top plate
  add(new THREE.BoxGeometry(0.9, 0.55, 0.95), dark, 0, 2.55, 0); // prism hump
  add(new THREE.BoxGeometry(0.5, 0.08, 0.4), silver, 0, 2.86, 0); // hot shoe
  add(new THREE.BoxGeometry(0.55, 1.4, 0.55), darker, 1.2, 1.2, 0.55); // grip
  add(new THREE.CylinderGeometry(0.3, 0.3, 0.14, 16), silver, -0.85, 2.32, 0); // mode dial
  add(new THREE.CylinderGeometry(0.15, 0.15, 0.1, 12), amber, 0.9, 2.3, 0.25); // shutter
  add(new THREE.BoxGeometry(0.2, 0.2, 0.06), new THREE.MeshBasicMaterial({ color: 0xff3b30 }), -1.0, 1.6, 0.67);

  const ring = (r, h, z, mat) =>
    add(new THREE.CylinderGeometry(r, r, h, 24).rotateX(Math.PI / 2), mat, 0, 1.25, z);
  ring(0.78, 0.2, 0.7, silver); // lens mount
  ring(0.66, 0.9, 1.2, dark); // barrel
  ring(0.72, 0.4, 1.35, darker); // focus ring
  ring(0.7, 0.06, 1.8, amber); // accent ring
  const front = ring(0.55, 0.08, 1.83, glass); // front glass
  add(new THREE.SphereGeometry(0.09, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }), 0.2, 1.45, 1.9);

  g.userData.front = front;
  return g;
}

/* Cosy stay: cottage, pines, lantern. Front faces +z */
export function buildStay() {
  const g = new THREE.Group();
  const add = adder(g);
  const wall = lambert(0xf1e7d0);
  const roofMat = lambert(0x9a3f2b);
  const wood = lambert(0x5a3a24);
  const stone = lambert(0x8d8a82);
  const warm = new THREE.MeshBasicMaterial({ color: 0xffd98a });
  const leaf = lambert(0x2f7a4f);
  const leafDark = lambert(0x1d5a3a);

  add(new THREE.BoxGeometry(2.7, 1.4, 2.0), wall, 0, 0.7, 0); // walls

  const tri = new THREE.Shape();
  tri.moveTo(-1.75, 0);
  tri.lineTo(1.75, 0);
  tri.lineTo(0, 1.25);
  tri.closePath();
  const roofGeo = new THREE.ExtrudeGeometry(tri, { depth: 2.5, bevelEnabled: false });
  roofGeo.translate(0, 0, -1.25);
  add(roofGeo, roofMat, 0, 1.4, 0); // roof

  add(new THREE.BoxGeometry(0.32, 0.8, 0.32), stone, 0.85, 2.15, -0.45); // chimney
  add(new THREE.BoxGeometry(0.5, 0.95, 0.06), wood, 0, 0.48, 1.02); // door
  add(new THREE.BoxGeometry(0.95, 0.12, 0.45), stone, 0, 0.06, 1.25); // step
  [-0.9, 0.9].forEach((x) => add(new THREE.BoxGeometry(0.55, 0.5, 0.06), warm, x, 0.85, 1.02));
  add(new THREE.BoxGeometry(0.06, 0.5, 0.55), warm, 1.36, 0.85, 0.2);
  const lantern = add(new THREE.SphereGeometry(0.1, 8, 8), warm, 0.55, 1.05, 1.1);

  // pines
  const pine = (x, z, s) => {
    const p = new THREE.Group();
    const a = adder(p);
    a(new THREE.CylinderGeometry(0.1, 0.14, 0.5, 6), wood, 0, 0.25, 0);
    a(new THREE.ConeGeometry(0.75, 1.2, 7), leaf, 0, 1.0, 0);
    a(new THREE.ConeGeometry(0.58, 1.0, 7), leafDark, 0, 1.65, 0);
    a(new THREE.ConeGeometry(0.4, 0.8, 7), leaf, 0, 2.2, 0);
    p.position.set(x, 0, z);
    p.scale.setScalar(s);
    g.add(p);
  };
  pine(-2.15, -0.2, 1.05);
  pine(2.1, 0.6, 0.85);
  pine(-1.6, -1.3, 0.7);

  // low tea-bush mounds in front
  [-1.7, -0.9, 1.1, 1.9].forEach((x, i) => {
    const b = add(new THREE.SphereGeometry(0.42, 8, 6), i % 2 ? leaf : leafDark, x, 0.1, 1.9 - (i % 2) * 0.25);
    b.scale.y = 0.55;
  });

  g.userData.lantern = lantern;
  return g;
}

/* Round forest-green stage the models stand on */
export function buildPlatform(radius = 3.3) {
  const g = new THREE.Group();
  const top = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius + 0.15, 0.3, 48),
    lambert(0x1d4a33),
  );
  top.position.y = -0.15;
  const rim = new THREE.Mesh(
    new THREE.CylinderGeometry(radius + 0.2, radius + 0.2, 0.07, 48),
    new THREE.MeshBasicMaterial({ color: 0xf4a63a }),
  );
  rim.position.y = -0.3;
  g.add(top, rim);
  return g;
}
