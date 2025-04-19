/* Copyright (c) 2025 Kaklik
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/
#include <KLSE/rendering/renderer.hpp>
namespace KLSE
{
    Color Color::lerp(Color a, Color b, Dimention t) {
        return Color(
            a.r + (b.r - a.r) * t,
            a.g + (b.g - a.g) * t,
            a.b + (b.b - a.b) * t,
            a.a + (b.a - a.a) * t
        );
    }
    Color RGBA::create(byte r, byte g, byte b, byte a) {
        return Color(r / 255.0f, g / 255.0f, b / 255.0f, a / 255.0f);
    }
    Color RGBA::to_color(RGBA rgba) {
        return Color(static_cast<float>(rgba.r) / 255.0f, static_cast<float>(rgba.g) / 255.0f, static_cast<float>(rgba.b) / 255.0f, static_cast<float>(rgba.a) / 255.0f);
    } 

    void Camera3D::update(Vec2 size){
        Matrix4 projection = matrix4::perspective(Math::deg_to_rad(fov), size.x / size.y, near, far);

        Matrix4 view = matrix4::translate(
            matrix4::rotate(matrix4::identity(),rotation),
            Vec3::neg(position)
        );

        this->matrix = matrix4::mult(projection, view);
    }
    void CameraI3D::update(Vec2 size){
        Matrix4 projection = matrix4::projection({(size.x/meter_size),(size.y/meter_size),1000});

        matrix = matrix4::translate(projection,Vec3(-position.x,-position.y,-position.z));
    }
    void Camera2D::update(Vec2 size){
        Matrix4 projection = matrix4::projection({(size.x/meter_size)*zoom,(size.y/meter_size)*zoom,500});

        matrix = matrix4::translate(projection,Vec3(-position.x,-position.y,0));
    }
    Vec2 Camera2D::pixel_to_meter(IVec2 vec){
        return (Vec2(vec)/meter_size);
    }
    DrawForm2D::~DrawForm2D(){
        if(this->collider!=nullptr){
            delete this->collider;
        }
    }
    void DrawForm2D::draw(Renderer* render,RContainer* container){
        Vec2 offset=Vec2::neg(container->real_position);
    }
    void RContainer::CalculateRealPosition(){
        if(parent){
            real_position=parent->real_position+position;
            //real_scale=Vec2::mult(parent->real_scale,scale);
        }else {
            real_position=position;
            //real_scale=scale;
        }
    }
    RContainer::~RContainer(){
        for(uint32_t i=0;i<this->forms.size();i++){
            delete this->forms[i];
        }
        for(uint32_t i=0;i<this->childs.size();i++){
            delete this->childs[i];
        }
    }
    DrawForm2D* RContainer::add_rectangle(Vec2 position,Vec2 size, Color color){
        DrawForm2D* form=new DrawForm2D();
        form->collider=new RectCollider2D(position,size);
        form->color=color;
        this->forms.push_back(form);
        return form;
    }
    DrawForm2D* RContainer::add_circle(Vec2 position,Dimention size, Color color){
        DrawForm2D* form=new DrawForm2D();
        form->collider=new CircleCollider2D(position,size);
        form->color=color;
        this->forms.push_back(form);
        return form;
    }
    void RContainer::draw(Renderer* render){
        this->CalculateRealPosition();
        for(uint32_t i=0;i<this->childs.size();i++){
            auto c=this->childs[i];
            c->draw(render);
        }
        for(uint32_t i=0;i<this->forms.size();i++){
            auto f=this->forms[i];
            f->draw(render,this);
        }
    }
    RContainer* RContainer::add_container(){
        auto cont=new RContainer();
        cont->parent=this;
        childs.push_back(cont);
        return cont;
    }

    namespace HEXCOLOR
    {
        Color create(std::string hex) {
            std::smatch result;
            switch (hex.length()) {
                case 4: // #RGB
                    if (std::regex_match(hex, result, std::regex("^#?([a-fA-F\\d])([a-fA-F\\d])([a-fA-F\\d])$"))) {
                        return {
                            std::stoi(result[1].str(), nullptr, 16) / 15.0f,
                            std::stoi(result[2].str(), nullptr, 16) / 15.0f,
                            std::stoi(result[3].str(), nullptr, 16) / 15.0f,
                            1.0f
                        };
                    }
                    break;
                case 5: // #RGBA
                    if (std::regex_match(hex, result, std::regex("^#?([a-fA-F\\d])([a-fA-F\\d])([a-fA-F\\d])([a-fA-F\\d])$"))) {
                        return {
                            std::stoi(result[1].str(), nullptr, 16) / 15.0f,
                            std::stoi(result[2].str(), nullptr, 16) / 15.0f,
                            std::stoi(result[3].str(), nullptr, 16) / 15.0f,
                            std::stoi(result[4].str(), nullptr, 16) / 15.0f
                        };
                    }
                    break;
                case 7: // #RRGGBB
                    if (std::regex_match(hex, result, std::regex("^#?([a-fA-F\\d]{2})([a-fA-F\\d]{2})([a-fA-F\\d]{2})$"))) {
                        return {
                            std::stoi(result[1].str(), nullptr, 16) / 255.0f,
                            std::stoi(result[2].str(), nullptr, 16) / 255.0f,
                            std::stoi(result[3].str(), nullptr, 16) / 255.0f,
                            1.0f
                        };
                    }
                    break;
                case 9: // #RRGGBBAA
                    if (std::regex_match(hex, result, std::regex("^#?([a-fA-F\\d]{2})([a-fA-F\\d]{2})([a-fA-F\\d]{2})([a-fA-F\\d]{2})$"))) {
                        return {
                            std::stoi(result[1].str(), nullptr, 16) / 255.0f,
                            std::stoi(result[2].str(), nullptr, 16) / 255.0f,
                            std::stoi(result[3].str(), nullptr, 16) / 255.0f,
                            std::stoi(result[4].str(), nullptr, 16) / 255.0f
                        };
                    }
                    break;
                default:
                    throw std::invalid_argument("Invalid Hex");
            }
            throw std::invalid_argument("Invalid Hex");
        }
    } // namespace HEX
} // namespace KLSE
