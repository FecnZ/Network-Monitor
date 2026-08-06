package com.networkmonitor.scanner.xml;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class NmapAddress {

    @JacksonXmlProperty(isAttribute = true)
    private String addr;

    @JacksonXmlProperty(isAttribute = true)
    private String addrtype;

    @JacksonXmlProperty(isAttribute = true)
    private String vendor;

}