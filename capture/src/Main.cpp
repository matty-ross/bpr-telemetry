#include <cstdlib>
#include <cstddef>
#include <cstdint>
#include <cstdio>
#include <Windows.h>


int main()
{
    FILE* csvTelemetryFile = nullptr;
    fopen_s(&csvTelemetryFile, "telemetry.csv", "w");
    if (csvTelemetryFile == nullptr)
    {
        return EXIT_FAILURE;
    }

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
            csvTelemetryFile,
            "%.3f,%.3f,%.3f,%.3f,%d,%016llX\n",
            *reinterpret_cast<float*>(guiPlayerInfo + 0x0),    // Position X
            *reinterpret_cast<float*>(guiPlayerInfo + 0x4),    // Position Y
            *reinterpret_cast<float*>(guiPlayerInfo + 0x8),    // Position Z
            *reinterpret_cast<float*>(guiPlayerInfo + 0x3C),   // Rotation
            *reinterpret_cast<int32_t*>(guiPlayerInfo + 0x30), // Speed (mph)
            *reinterpret_cast<uint64_t*>(guiPlayerInfo + 0x10) // Vehicle CgsID (compressed)
        );
    }

    fclose(csvTelemetryFile);

    return EXIT_SUCCESS;
}
