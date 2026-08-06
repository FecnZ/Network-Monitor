package com.networkmonitor.scanner.xml;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class NmapPort {

    @JacksonXmlProperty(isAttribute = true)
    private String protocol;

    @JacksonXmlProperty(isAttribute = true)
    private int portid;

    @JacksonXmlProperty(localName = "state")
    private NmapState state;

    @JacksonXmlProperty(localName = "service")
    private NmapService service;

}