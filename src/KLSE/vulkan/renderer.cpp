#include <KLSE/vulkan/renderer.hpp>
namespace KLSE
{
    #define DEFAULT_WINDOWS_SIZE_X 800
    #define DEFAULT_WINDOWS_SIZE_Y 600

    VkInstance instance;
    VkApplicationInfo appInfo;
    VkPhysicalDevice physicalDevice;
    VkInstanceCreateInfo createInfo;
    void VulkanInit(){
        appInfo = {};
        appInfo.sType = VK_STRUCTURE_TYPE_APPLICATION_INFO;
        appInfo.pApplicationName = "Vulkan App";
        appInfo.applicationVersion = VK_MAKE_VERSION(1, 0, 0);
        appInfo.pEngineName = "No Engine";
        appInfo.engineVersion = VK_MAKE_VERSION(1, 0, 0);
        appInfo.apiVersion = VK_API_VERSION_1_0;

        createInfo = {};
        createInfo.sType = VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO;
        createInfo.pApplicationInfo = &appInfo;

        if (vkCreateInstance(&createInfo, nullptr, &instance) != VK_SUCCESS) {
            std::cerr << "Failed to create Vulkan instance" << std::endl;
            exit(1);
        }

        physicalDevice = VK_NULL_HANDLE;

        uint32_t deviceCount = 0;
        vkEnumeratePhysicalDevices(instance, &deviceCount, nullptr);

        if (deviceCount == 0) {
            std::cerr << "Failed to find GPUs with Vulkan support" << std::endl;
            exit(-1);
        }

        std::vector<VkPhysicalDevice> devices(deviceCount);
        vkEnumeratePhysicalDevices(instance, &deviceCount, devices.data());

        for (const auto& device : devices) {
            if (true /* Check if the device is suitable */) {
                physicalDevice = device;
                break;
            }
        }

        if (physicalDevice == VK_NULL_HANDLE) {
            std::cerr << "Failed to find a suitable GPU" << std::endl;
            exit(-1);
        }
    }
    void framebuffer_size_callback(GLFWwindow* window, int width, int height) {
        VulkanWindow* wuser=reinterpret_cast<VulkanWindow*>(glfwGetWindowUserPointer(window));
        if(wuser){
            wuser->renderer->set_viewport(IVec2(width,height));
        }
    }
    VulkanWindow::VulkanWindow():Window(){
        window=glfwCreateWindow(DEFAULT_WINDOWS_SIZE_X, DEFAULT_WINDOWS_SIZE_Y, "KLSE Windows", nullptr, nullptr);
        if (!window) {
            std::cerr << "Failed to create GLFW window " << window << std::endl;
            glfwTerminate();
            exit(-1);
        }
        glfwMakeContextCurrent(window);
        VkSurfaceKHR surface;
        if (glfwCreateWindowSurface(instance, window, nullptr, &surface) != VK_SUCCESS) {
            std::cerr << "Failed to create window surface" << std::endl;
            exit(-1);
        }

        renderer=new VulkanRenderer();

        // Set the user pointer to this instance
        glfwSetWindowUserPointer(window, this);

        glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);

        renderer->init(this);
        renderer->set_viewport(IVec2(DEFAULT_WINDOWS_SIZE_X, DEFAULT_WINDOWS_SIZE_Y));
    }
    IVec2 VulkanWindow::get_size(){
        IVec2 ret;
        glfwGetWindowSize(window,&(ret.x),&(ret.y));
        return ret;
    }
    void VulkanWindow::set_size(IVec2 size){
        glfwSetWindowSize(window,size.x,size.y);
    }
    std::string VulkanWindow::get_title(){
        return glfwGetWindowTitle(window);
    }
    void VulkanWindow::set_title(std::string title){
        return glfwSetWindowTitle(window,title.c_str());
    }
    void VulkanWindow::close(){
        glfwTerminate();
    }
    bool VulkanWindow::closed(){
        return glfwWindowShouldClose(window);
    }
    void VulkanWindow::update(){
        // Trocar os buffers
        glfwSwapBuffers(window);
        glfwPollEvents();
    }

    void VulkanRenderer::init(Window* window){
        this->window=window;
    }
    void VulkanRenderer::clear(){
    }
    
    void VulkanRenderer::draw_rect2D(RectCollider2D* rect, Color normal,Vec2 offset){
        float x1 = rect->position.x-offset.x;
        float y1 = rect->position.y-offset.y;
        float x2 = (rect->position.x-offset.x) + rect->size.x;
        float y2 = (rect->position.y-offset.y) + rect->size.y;

        /*glBegin(GL_QUADS);

        glVertex2f(x1,y1);
        glVertex2f(x2,y1);
        glVertex2f(x2,y2);
        glVertex2f(x1,y2);

        glEnd();*/

        /*_draw_simple_vertex({
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2
        }, normal);*/
        _draw_simple_vertex({
           -0.5f, -0.5f, 0.0f,
            0.5f, -0.5f, 0.0f,
            0.0f,  0.5f, 0.0f
        }, normal);
    }
    void VulkanRenderer::_draw_simple_vertex(const std::vector<float>& vertex, Color color, GLenum mode){
        
    }
    void VulkanRenderer::set_viewport(IVec2 size){
        if(projectionMatrix){
            delete projectionMatrix;
        }
        projectionMatrix=matrix4::projection(Vec3(size.x/this->meter_size,size.y/this->meter_size,500/this->meter_size));
    }
}
