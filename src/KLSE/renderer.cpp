#include <KLSE/renderer.hpp>
#include <stdexcept>
#include <regex>
namespace KLSE
{
        Color RGBA::create(int r, int g, int b, int a) {
            return Color(r / 255.0f, g / 255.0f, b / 255.0f, a / 255.0f);
        }
        Color RGBA::create(int r, int g, int b) {
            return Color(r / 255.0f, g / 255.0f, b / 255.0f);
        }
        Color RGBA::from(RGBA json) {
            return Color(json.r / 255.0f, json.g / 255.0f, json.b / 255.0f, json.a / 255.0f);
        } 
    
    void Camera3D::update(Vec2 size){
        Matrix4 projection = matrix4::perspective(Math::Deg2Rad(fov), size.x / size.y, near, far);

        Matrix4 view = matrix4::translate(
            matrix4::rotate(matrix4::identity(),rotation),
            Vec3::neg(position)
        );

        this->matrix = matrix4::mult(projection, view);
    }
    DrawForm2D::~DrawForm2D(){
        if(this->collider!=nullptr){
            delete this->collider;
        }
    }
    void DrawForm2D::draw(Renderer* render,RContainer* container){
        Vec2 offset=Vec2::neg(container->real_position);
        render->draw_collider2D(this->collider,this->color,offset);
    }
    void RContainer::CalculateRealPosition(){
        if(this->parent)this->real_position=Vec2::add(parent->real_position,this->position);
        else this->real_position=this->position;
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
