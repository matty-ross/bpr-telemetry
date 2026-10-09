#include <cstdlib>
#include <cstddef>
#include <cstdint>
#include <cstdio>
#include <Windows.h>


constexpr char k_TelemetryFileName[] = "telemetry.csv";


int main()
{
    FILE* telemetryFile = nullptr;
    fopen_s(&telemetryFile, k_TelemetryFileName, "w");
    if (telemetryFile == nullptr)
    {
        return EXIT_FAILURE;
    }

    printf_s("Writing telemetry data to file '%s'.\nPress F12 to exit.\n", k_TelemetryFileName);

    while (true)
    {
        Sleep(1000);

        if (GetAsyncKeyState(VK_F12) & 0x8000)
        {
            break;
        }

        HWND windowHandle = FindWindowA("BurnoutParadiseWindowClass", "Burnout(TM) Paradise Remastered");
        if (windowHandle == NULL)
        {
            continue;
        }

        DWORD processID = 0;
        if (GetWindowThreadProcessId(windowHandle, &processID) == 0)
        {
            continue;
        }

        HANDLE processHandle = OpenProcess(PROCESS_ALL_ACCESS, FALSE, processID);
        if (processHandle == NULL)
        {
            continue;
        }

        void* gameModuleAddress = nullptr;
        ReadProcessMemory(processHandle, reinterpret_cast<void*>(0x013FC8E0), &gameModuleAddress, 4, nullptr);
        if (gameModuleAddress == nullptr)
        {
            continue;
        }

        std::byte guiPlayerInfo[0x50] = {}; // BrnGui::GuiPlayerInfo
        ReadProcessMemory(processHandle, reinterpret_cast<void*>(reinterpret_cast<uintptr_t>(gameModuleAddress) + 0x8EFEC0), guiPlayerInfo, sizeof(guiPlayerInfo), nullptr);

        fprintf_s(
            telemetryFile,
            "%.3f,%.3f,%.3f,%.3f,%d\n",
            *reinterpret_cast<float*>(guiPlayerInfo + 0x0),        // Position X
            *reinterpret_cast<float*>(guiPlayerInfo + 0x4),        // Position Y
            *reinterpret_cast<float*>(guiPlayerInfo + 0x8),        // Position Z
            *reinterpret_cast<float*>(guiPlayerInfo + 0x3C),       // Rotation
            abs(*reinterpret_cast<int32_t*>(guiPlayerInfo + 0x30)) // Speed (mph)
        );
    }

    fclose(telemetryFile);

    return EXIT_SUCCESS;
}
