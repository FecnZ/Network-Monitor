package com.networkmonitor.scanner.xml;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class NmapHostname {

    @JacksonXmlProperty(isAttribute = true)
    private String name;

}