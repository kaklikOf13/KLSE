import {v2, v3} from "../utils/geometry.ts"
import { assertEquals } from "https://deno.land/std/testing/asserts.ts"
Deno.test("Vector2 Basics", () => {
    assertEquals(v2.add(v2.new(1,1),v2.new(2,2)), v2.new(3,3))
    assertEquals(v2.sub(v2.new(3,3),v2.new(2,2)), v2.new(1,1))
    assertEquals(v2.scale(v2.new(2,2),6), v2.new(12,12))
    assertEquals(v2.dscale(v2.new(12,12),2), v2.new(6,6))
    assertEquals(v2.mult(v2.new(12,12),v2.new(2,1)), v2.new(24,12))
    assertEquals(v2.div(v2.new(12,12),v2.new(2,1)), v2.new(6,12))
})

Deno.test("Vector3 Basics", () => {
    assertEquals(v3.add(v3.new(1,1,1),v3.new(2,2,2)), v3.new(3,3,3))
    assertEquals(v3.sub(v3.new(3,3,6),v3.new(2,2,1)), v3.new(1,1,5))
    assertEquals(v3.scale(v3.new(2,2,1),6), v3.new(12,12,6))
    assertEquals(v3.dscale(v3.new(12,12,10),2), v3.new(6,6,5))
    assertEquals(v3.mult(v3.new(12,2,12),v3.new(2,2,2)), v3.new(24,4,24))
    assertEquals(v3.div(v3.new(10,12,12),v3.new(2,2,1)), v3.new(5,6,12))
})