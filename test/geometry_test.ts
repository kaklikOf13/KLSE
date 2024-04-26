import {Vec,Vector} from "../geometry.ts"
import { assertEquals } from "https://deno.land/std/testing/asserts.ts"
Deno.test("Vector Basics", () => {
    assertEquals(Vec.add(Vec.new(1,1),Vec.new(2,2)), Vec.new(3,3))
    assertEquals(Vec.sub(Vec.new(3,3),Vec.new(2,2)), Vec.new(1,1))
    assertEquals(Vec.scale(Vec.new(2,2),6), Vec.new(12,12))
    assertEquals(Vec.dscale(Vec.new(12,12),2), Vec.new(6,6))
    assertEquals(Vec.mult(Vec.new(12,12),Vec.new(2,1)), Vec.new(24,12))
    assertEquals(Vec.div(Vec.new(12,12),Vec.new(2,1)), Vec.new(6,12))
})