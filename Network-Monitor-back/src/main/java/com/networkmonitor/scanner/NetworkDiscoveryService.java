package com.networkmonitor.scanner;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.InterfaceAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Enumeration;

@Service
@Slf4j
public class NetworkDiscoveryService {

    /**
     * Detecta la subred local (CIDR) a partir de la interfaz de red activa de esta máquina.
     * Ignora loopback y virtuales (VPN, Docker, etc.).
     */
    public String detectLocalSubnet() {
        try {
            Enumeration<NetworkInterface> interfaces = NetworkInterface.getNetworkInterfaces();

            while (interfaces.hasMoreElements()) {
                NetworkInterface iface = interfaces.nextElement();

                if (iface.isLoopback() || !iface.isUp() || iface.isVirtual()) {
                    continue;
                }

                for (InterfaceAddress addr : iface.getInterfaceAddresses()) {
                    InetAddress inet = addr.getAddress();
                    if (inet instanceof Inet4Address) {
                        int prefixLength = addr.getNetworkPrefixLength();
                        String networkAddress = calculateNetworkAddress(
                                inet.getHostAddress(), prefixLength);
                        String subnet = networkAddress + "/" + prefixLength;
                        log.info("Subred detectada automáticamente: {} (interfaz: {})",
                                subnet, iface.getDisplayName());
                        return subnet;
                    }
                }
            }
        } catch (SocketException e) {
            log.error("Error al enumerar interfaces de red: ", e);
        }

        throw new IllegalStateException(
                "No se pudo detectar automáticamente una subred válida.");
    }

    private String calculateNetworkAddress(String ip, int prefixLength) {
        String[] octets = ip.split("\\.");
        int ipInt = 0;
        for (String octet : octets) {
            ipInt = (ipInt << 8) | Integer.parseInt(octet);
        }

        int mask = prefixLength == 0 ? 0 : (0xFFFFFFFF << (32 - prefixLength));
        int networkInt = ipInt & mask;

        return String.format("%d.%d.%d.%d",
                (networkInt >> 24) & 0xFF,
                (networkInt >> 16) & 0xFF,
                (networkInt >> 8) & 0xFF,
                networkInt & 0xFF);
    }
}