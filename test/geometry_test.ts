import {v2} from "../utils/geometry.ts"
import { assertEquals } from "https://deno.land/std/testing/asserts.ts"
Deno.test("Vector Basics", () => {
    assertEquals(v2.add(v2.new(1,1),v2.new(2,2)), v2.new(3,3))
    assertEquals(v2.sub(v2.new(3,3),v2.new(2,2)), v2.new(1,1))
    assertEquals(v2.scale(v2.new(2,2),6), v2.new(12,12))
    assertEquals(v2.dscale(v2.new(12,12),2), v2.new(6,6))
    assertEquals(v2.mult(v2.new(12,12),v2.new(2,1)), v2.new(24,12))
    assertEquals(v2.div(v2.new(12,12),v2.new(2,1)), v2.new(6,12))
})