package com.networkmonitor.scanner.xml;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class NmapHost {

    @JacksonXmlProperty(localName = "address")
    @JacksonXmlElementWrapper(useWrapping = false)
    private List<NmapAddress> addresses;

    @JacksonXmlProperty(localName = "hostnames")
    private NmapHostnames hostnames;

    @JacksonXmlProperty(localName = "ports")
    private NmapPorts ports;

    @JacksonXmlProperty(localName = "status")
    private NmapStatus status;

    public boolean isUp() {
        return status != null && "up".equals(status.getState());
    }

    /** Busca la dirección IPv4 del host. */
    public String getIpAddress() {
        if (addresses == null) return null;
        return addresses.stream()
                .filter(a -> "ipv4".equals(a.getAddrtype()))
                .map(NmapAddress::getAddr)
                .findFirst()
                .orElse(null);
    }

    /** Busca la dirección MAC del host, si existe. */
    public NmapAddress getMacAddress() {
        if (addresses == null) return null;
        return addresses.stream()
                .filter(a -> "mac".equals(a.getAddrtype()))
                .findFirst()
                .orElse(null);
    }

    public String getHostname() {
        if (hostnames == null || hostnames.getHostnameList() == null
                || hostnames.getHostnameList().isEmpty()) {
            return null;
        }
        return hostnames.getHostnameList().getFirst().getName();
    }
}