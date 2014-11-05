Win7PE by M@ximus FullRAM Rus
=======================================================================================================================

LiveCD-сборка, основанная на Windows 7 SP1 Ultimate x86.

Малый размер образа(~300 Mb), использование RAM ~400-450 Mb (система и программы загружаются в память целиком).
Загрузка в течение 1-2 минут (USB 3.0), 2-3 минут (USB 2.0) или 7-10 минут (старые компьютеры с USB 1.1).

=======================================================================================================================


Установленные программы:

Архивы: 7zip, WinRAR.

Информация о системе: AdapterWatch, CPUid, DeviceMonitor, S&M, SIW, SpaceSniffer.

Устройства и оборудование: DoubleDriver, DriverInjection, ServiWin, HWPnP, USBDeviceView.

Восстановление данных: R-Studio, UFS Explorer, TestDisk, VictoriaHDD (загружаемый образ дискеты).

Удаление вирусов: AVZ, HijackThis!, UniversalVirusScaner, AntiSMS, AntiWinLocker.

Восстановление паролей:  NTPEdit, PasswordRenew, PasswordScan, ProduKey, SAMInside, WindowsGate.

Безопасность: TrueCrypt, DiskCryptor, Tor.

Диски: Acronis DiskDirector (загружаемый linux-образ), Paragon HomeExpert, HP Disk FormatTool, ATTO Disk Benchmark, Defraggler, HDTune, драйвера и программы для работы с Linux и Mac-разделами (ext2/3/4,ReiserFS,UFS,XFS,HFS).

Реестр: RegWorkshop, Runscanner.

Автозагрузка: AutoRuns, ServiWin.

Файловые менеджеры: Проводник Windows, Total-Commander. Дополнительно: ExtremeCopy.

Процессы: ProcessMonitor, ProcessHacker (заменяет Диспетчер задач).

Удаленное управление: Ammy Admin, UltraVNC.

Запись CD/DVD + монтирование ISO-образов: ImgBurn, UltraISO, ImDisk.

Wi-Fi: WirelessNetView, WNetWatcher, PENetwork.

Браузеры: Mozilla Firefox.

Интернет-приложения: uTorrent, Putty, HyperTerminal, Tor, IP-Tools, утилиты от Nirsoft для просмотра истории, кэша, паролей и куков в браузерах Mozilla Firefox, Opera, Safari, Chrome и Internet Explorer.

Офис: DJVU-Reader, SumatraPDF, xCHM, Shtirlitz4, AkelPad, SoftMakerOffice (внешний wim-пакет).

Изображения: FastStoneMaxView, PicPick, XNView.

Мультимедиа: MediaPlayerClassic (видео кодеки расположены во внешнем wim-пакете).

Клавиатура: PuntoSwitcher, FreeVirtualKeyboard.

Дополнительно: GImageX, WinNTSetup, MemoryCleaner, Resolution, ShellExView, DependencyWalker, UPX, Restorator, DesktopLocker, CloneSpy, AutoIt3 (внешний wim-пакет).


=======================================================================================================================

Большинство .exe и .dll файлов сжато с помощью ASPack и UPX для уменьшения их размера. 

Установлен патч ядра для использования более 4 Gb RAM.

Hабота на системах с 512Мб RAM возможна только с файлом подкачки.

Глобальные горячие клавиши на вызов программ (список расположен в windows\system32\hotkeys.ini)

=======================================================================================================================

Примечания:

В папке /boot.wim расположены системные файлы и внутренние программы. Её содержимое запаковывается в файл boot.wim с аттрибутом Загрузочный (скрипт делает все сам, но можно сделать вручную с помощью Imagex или GImagex) и поместить в папку Sources в корне LiveCD-диска.

В папке /Programs расположены папки с внешними программами, которые будут подключены после загрузки. Содержимое каждой подпапки (/название_программы_.wim/) должно быть упаковано в wim-файл с тем же названием (название_программы_.wim).

Пример структуры, а также необходимые файлы загрузчика приведены в файле LiveCD.iso.

Чтобы собрать LiveCD, нужно запустить файл make_iso.bat. Готовый образ имеет название Win7Pe.iso. Для сборки наличие установленного в системе драйвера wimfltr обязательно!
